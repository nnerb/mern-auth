import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const signup = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }

    const alreadyExists = await User.findOne({
      email
    });

    if (alreadyExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 123456 => @3$%#^&*
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })

    await user.save();
    
    generateTokenAndSetCookie(res, user._id) 

    return res.status(201).json({ 
      message: 'User created successfully',
      user: {
        ...user._doc,
        password: undefined
      },
      success: true, 
    });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message }); 
  }
}

export const login = async (req, res) => {
  res.send('This is the login route');
}

export const logout = async (req, res) => {
  res.send('This is the logout route');
}