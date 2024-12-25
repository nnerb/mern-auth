import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

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
    
    await sendVerificationEmail(user.email, verificationToken);

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
    return res.status(500).json({ success: false, error: "Server Error" }); 
  }
}

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({ 
      message: 'Email verified successfully',
      success: true, 
      user: {
        ...user._doc,
        password: undefined
      }
    });

  } catch (error) { 
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" }); 
  }
}

export const login = async (req, res) => {
  res.send('This is the login route');
}

export const logout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ 
    success: true, 
    message: 'Logged out successfully'
 });
}