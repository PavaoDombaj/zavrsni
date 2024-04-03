import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    let username = ""; // Declare the variable outside the if-else block

    if (!req.body.username || req.body.username === null) {
      console.log("Nema username");
      const nameParts = req.body.name.split(" ");

      if (nameParts.length > 1) {
        username = nameParts.join("").toLowerCase();
      } else {
        // Ako imate samo jedno ime, stavi to ime samo lowercase
        username = `${nameParts[0].toLowerCase()}`;
      }

      // Provjeri postoji li korisnik s istim imenom u bazi
      const existingUser = await User.findOne({ username });

      // Ako postoji, dodaj random slovo na kraj korisničkog imena
      if (existingUser) {
        const randomNum = Math.floor(10 + Math.random() * 90);
        username = `${username}${randomNum}`;
      }

      console.log(username);
    } else {
      // Assign the value to the existing username variable
      username = req.body.username;
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
      // Invalid password or username
      return next(createError(400, "Invalid password or username"));
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
