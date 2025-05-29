import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  ACCESS_SECRET,
  REFRESH_SECRET,
  NODE_ENV,
  FRONTEND_URL,
} from '../config/env.config.js';
import sendEmail from '../utils/sendEmail.js';

// CREATE USER
export const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields must be provided' });
  }

  try {
    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const accessToken = jwt.sign({ id: newUser._id }, ACCESS_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ id: newUser._id }, REFRESH_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.error('User creation failed:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and Password required' });
  }

  try {
    const existingUser = await User.findOne({ email, isDeleted: false });

    if (!existingUser) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: existingUser._id }, ACCESS_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ id: existingUser._id }, REFRESH_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// PATCH USER
export const updateUser = async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user.id;

  if (!username || !email) {
    return res.status(400).json({ error: 'All fields must be provided' });
  }

  try {
    const emailTaken = await User.findOne({ email, _id: { $ne: userId } });
    if (emailTaken) {
      return res.status(409).json({ error: 'Email is already in use' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ error: 'No refresh token' });
  }

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      isDeleted: false,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newAccessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, {
      expiresIn: '15m',
    });

    return res.status(200).json({
      success: true,
      data: {
        user,
        accessToken: newAccessToken,
      },
    });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
};
0;

// LOGOUT
export const logoutUser = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'Strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// PASSWORD RECOVER
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: 'If that email exists, a reset link will be sent.' });
    }

    const secret = ACCESS_SECRET + user.password;
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '15m' });

    const link = `${process.env.FRONTEND_URL}/reset-password/${user._id}/${token}`;

    await sendEmail(
      user.email,
      'Password Reset',
      `
      <h3>Password Reset</h3>
      <p>Click the link below to reset your password. It expires in 15 minutes.</p>
      <a href="${link}">${link}</a>
    `
    );

    return res
      .status(200)
      .json({ message: 'If that email exists, a reset link will be sent.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// RESET PASSWORD

export const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ error: 'Invalid user' });

    const secret = ACCESS_SECRET + user.password;

    jwt.verify(token, secret);

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: 'Password successfully updated' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};
