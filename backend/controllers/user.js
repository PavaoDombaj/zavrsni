import User from "../models/User.js";

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    console.log("Updatean user");
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted!");
  } catch (err) {
    next(err);
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Izdvoji polje s lozinkom kako se ne bi slalo u odgovoru
    const { password, ...userData } = user.toObject();

    res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
};
export const getUserInfo = async (userId) => {
  try {
    // Ovdje dohvatite podatke o korisniku na temelju ID-a
    // Na primjer, možete upitati bazu podataka ili neki API
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Izdvojite polje s lozinkom ako je potrebno
    const { password, ...userData } = user.toObject();

    // Vratite podatke o korisniku u JSON formatu
    return userData;
  } catch (err) {
    // Uhvatite i obradite grešku
    throw new Error("Error fetching user details: " + err.message);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
