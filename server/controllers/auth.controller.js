import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { 
  sendVerificationEmail, 
  sendWelcomeEmail, 
  sendPasswordResetEmail, 
  sendResetSuccessEmail 
} from "../mailtrap/emails.js";
import crypto from "crypto";

export const signup = async (req, res) => {
  try {
    const { email, name, password } = req.body;
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
  try {
    const { code } = req.body;
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
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    generateTokenAndSetCookie(res, user._id)
    user.lastLogin = Date.now();
    await user.save();

    return res.status(200).json({ 
      success: true, 
      message: 'Logged in successfully',
      user: {
        ...user._doc,
        password: undefined
      }
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" }); 
  }
}

export const logout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ 
    success: true, 
    message: 'Logged out successfully'
 });
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const resetPasswordToken = crypto.randomBytes(20).toString('hex'); // generate a random token
    const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt

    await user.save();

    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${user.resetPasswordToken}`);

    return res.status(200).json({ 
      message: 'Password reset email sent successfully',
      success: true, 
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" }); 
  }
}

export const resetPassword = async (req, res) => { 
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired reset token' });
    }
    //update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    
    await sendResetSuccessEmail(user.email);

    await user.save();

    return res.status(200).json({ 
      message: 'Password reset successfully',
      success: true, 
    });

  } catch (error) { 
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" }); 
  }
}

export const checkAuth = async (req, res) => { 
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }
    
    return res.status(200).json({ success: true, user })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" }); 
  } 
}