import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    let username = "";

    if (!req.body.username || req.body.username === null) {
      const nameParts = req.body.name.split(" ");
      if (nameParts.length > 1) {
        username = nameParts.join("").toLowerCase();
      } else {
        username = `${nameParts[0].toLowerCase()}`;
      }
      // Provjeri postoji li korisnik s istim usernamom u bazi
      let existingUser = await User.findOne({ username });
      // Ako postoji, dodaj random broj na kraj korisničkog imena
      while (existingUser) {
        const randomNum = Math.floor(10 + Math.random() * 90);
        username = `${username}${randomNum}`;
        existingUser = await User.findOne({ username }); // Provjeri ponovno s novim usernameom
      }
    } else {
      username = req.body.username;
    }

    // Provjeri postoji li korisnik s istom e-poštom u bazi
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).send("Email is already registered.");
    }

    const newUser = new User({
      name: req.body.name,
      username: username,
      email: req.body.email,
      phone: req.body.phone,
      password: hash,
    });

    await newUser.save();
    res.status(201).send("User has been created");
  } catch (err) {
    next(err);
  }
};



export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });

    if (!user) {
      // User not found
      return next(createError(404, "User not found"));
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      // Kriva zaporka ili email
      return next(createError(400, "Invalid password or email"));
    }

    // Sign the JWT token
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT
    );

    // Destructure user details, excluding sensitive information
    const { password, isAdmin, ...otherDetails } = user._doc;

    // Send the token in a cookie and user details in the response
    res
      .cookie("access_token", token, {
        httpOnly: true,
        path: "/",
      })
      .status(200)
      .json(otherDetails);

    console.log("Access token " + token);
  } catch (err) {
    next(err);
  }
};
export const logout = async (req, res, next) => {
  try {
    // Brišemo cookie access_token
    res.clearCookie('access_token');
    
    // Vraćamo uspješan odgovor
    res.status(200).json({ success: true, message: 'User logged out successfully' });
  } catch (error) {
    // Uhvatimo i obradimo bilo kakvu grešku
    console.error('Error logging out:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
