import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

//register new user
//@route POST /api/auth/register

const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, adminInviteToken } =
      req.body;

    //check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    //Determine user role:Admin if correct token is provided otherwise Member
    let role = "member";
    if (
      adminInviteToken &&
      adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin";
    }
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
 
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || "An unknown error occurred",
    });
  }
};

//login user
//@route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    //return user data with jwt
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
   
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || "An unknown error occurred",
    });
  }
};

//get user profile
//@route GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      user
    });
  } catch (error) {
    
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || "An unknown error occurred",
    });
  }
};

//update user profile
//@route PUT /api/auth/profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
    }
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
  
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || "An unknown error occurred",
    });
  }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile };
