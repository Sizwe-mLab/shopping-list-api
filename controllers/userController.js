import User from "../models/user.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/index.js";
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    /*
    hash password before saving
    bcrypt.hash: This function is imported from the bcrypt library and is used to create a hashed representation of a password.
    The salt round count determines how many times a computer has to work hard to create a super strong code for your password.
    This makes it really difficult for bad guys to guess your password, even if they have powerful computers. 
    The more rounds you have the better
    Think of it like if you have a locked door. The key is your password. The more times you turn the key to lock the door
    the more harder it is for an itruder to unlock the door.

    if you think of it like that, you'll live longer
    */

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.matchPasswords(password))) {
      return res.status(401).json({
        error: "Invalid login credentials",
      });
    }
    const token = await generateToken(user._id);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error); // Log the actual error for debugging
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  registerUser,
  loginUser,
};
