import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// CREATE USER
export const signUp = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      image,
      phone,
      isAdmin,
      street,
      apartment,
      zip,
      city,
      country,
    } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "The email already exists" });
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }
    const user = new User({
      name,
      email,
      password,
      image,
      isAdmin,
      phone,
      street,
      apartment,
      zip,
      city,
      country,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create a JWT
    const payload = {
      user: user._id,
      name: user.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "1234!@#%<{*&)", { expiresIn: "24h" });

    res.status(201).json({ message: "Signup Successful", data: user.name, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check If The Input Fields are Valid
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please Input email and Password" });
    }
    // Check If User Exists In The Database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Compare Passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Generate JWT Token
    const token = jwt.sign(
      { user: user._id, name: user.name },
      process.env.JWT_SECRET || "1234!@#%<{*&)",
      { expiresIn: "1h" }
    );
    return res
      .status(200)
      .json({ message: "Login Successful", data: user.name, token }); //should be like here
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error during login" });
  }
};




// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find({}, { password: 0 }); // Exclude the password field from the response
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error fetching users" });
  }
};




// LOGGED IN
export const loggedIn = async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select("-password")
      res.json(user);
  } catch (error) {
      res.json(error.stack);
  }
};



//UPDATE
export const updateUser = async (req, res) => {
  try {
      const { name, email, password, phone, street, apartment, zip, city, country, image } = req.body;
      const user = await User.findById(req.user.id);
      if(!user) {
          return res.status(404).json({message: "User not found!"});
      }
      // update fields
      if (name) user.name = name;
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (street) user.street = street;
      if (apartment) user.apartment = apartment;
      if (zip) user.zip = zip;
      if (city) user.city = city;
      if (country) user.country = country;
      if (image) user.image = image;
      await user.save();
      res.status(200).json({message: "User updated successfully", user });
  } catch (error) {
      res.json(error.stack);
  }
};


// DELETE
export const deleteUser = async (req, res) => {
  try {
      //find user by id
      const user = await User.findById(req.user.id);
      //checking, if user exists
      if(!user) {
          return res.status(404).json({message: "User not found"});
      }
      await User.findByIdAndDelete(req.user.id);
      res.status(200).json({message: "User deleted successfully"});
  } catch (error) {
      res.status(500).json({message: "Server error", error: error.stack});
  }
};