import mongoose from 'mongoose';
import User from '../models/User.js';
import logActivity from '../utils/logActivity.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  ACCESS_SECRET,
  REFRESH_SECRET,
  NODE_ENV,
  FRONTEND_URL,
} from '../config/env.config.js';
import sendEmail from '../utils/sendEmail.js';
import verifyRecaptcha from '../utils/recaptcha.js';

// Helper to set access & refresh token cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// CREATE USER
export const createUser = async (req, res) => {
  const { username, email, password, recaptchaToken } = req.body;

  if (!username || !email || !password || !recaptchaToken) {
    return res
      .status(400)
      .json({ error: 'All fields and recaptchaToken must be provided' });
  }

  const recaptchaResponse = await verifyRecaptcha(recaptchaToken);

  if (!recaptchaResponse.success) {
    return res.status(400).json({ error: 'reCAPTCHA verification failed' });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
      isDeleted: false,
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      if (existingUser.username === username) {
        return res.status(409).json({ error: 'Username already exists' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await logActivity({
      userId: newUser._id,
      action: 'register',
      req,
    });

    const accessToken = jwt.sign({ id: newUser._id }, ACCESS_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ id: newUser._id }, REFRESH_SECRET, {
      expiresIn: '7d',
    });

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      },
    });
  } catch (error) {
    console.error('User creation failed:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  if (!email || !password || !recaptchaToken) {
    return res
      .status(400)
      .json({ error: 'Email, Password, and recaptchaToken required' });
  }

  const recaptchaResponse = await verifyRecaptcha(recaptchaToken);

  if (!recaptchaResponse.success) {
    return res.status(400).json({ error: 'reCAPTCHA verification failed' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    if (existingUser.isDeleted) {
      return res.status(403).json({ error: 'This account has been disabled' });
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

    setAuthCookies(res, accessToken, refreshToken);

    await logActivity({
      userId: existingUser._id,
      action: 'login',
      req,
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
  let userId = req.user._id;
  if (req.user.role === 'admin' && req.params.id) {
    userId = req.params.id;
  }

  if (!username || !email) {
    return res.status(400).json({ error: 'All fields must be provided' });
  }

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
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

    await logActivity({
      userId,
      action: 'update_user',
      req,
    });

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

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    await logActivity({
      userId: user._id,
      action: 'refresh_token',
      req,
    });

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
};

// LOGOUT
export const logoutUser = async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  await logActivity({
    userId: req.user._id,
    action: 'logout',
    req,
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

// PASSWORD RECOVER
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (user) {
      const secret = ACCESS_SECRET + user.password;
      const token = jwt.sign({ id: user._id }, secret, { expiresIn: '15m' });
      const link = `${FRONTEND_URL}/reset-password/${user._id}/${token}`;

      await sendEmail(
        user.email,
        'Password Reset',
        `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password. It expires in 15 minutes.</p>
        <a href="${link}">${link}</a>
      `
      );

      await logActivity({
        userId: user._id,
        action: 'forgot_password',
        req,
      });
    }

    return res.status(200).json({
      message: 'If that email exists, a reset link will be sent.',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ error: 'Invalid user' });

    const secret = ACCESS_SECRET + user.password;
    jwt.verify(token, secret);

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    await logActivity({
      userId: user._id,
      action: 'reset_password',
      req,
    });

    res.status(200).json({ message: 'Password successfully updated' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: 'Current and new password are required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    await logActivity({
      userId,
      action: 'change_password',
      req,
    });

    res.status(200).json({ message: 'Password successfully changed' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// SOFT DELETE USER
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const isAdmin = req.user.role === 'admin';
  const isOwner = req.user._id.toString() === id;

  if (!isAdmin && !isOwner) {
    return res
      .status(403)
      .json({ error: 'Forbidden: Not allowed to delete this user' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        canRestore: isOwner,
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    await logActivity({
      userId: req.user._id,
      action: 'soft_delete_user',
      req,
      details: { deletedUserId: user._id },
    });

    return res.status(200).json({ message: 'User soft deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// RESTORE USER
export const restoreUser = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const isAdmin = req.user.role === 'admin';
  const isOwner = req.user._id.toString() === id;

  if (!isAdmin && !isOwner) {
    return res
      .status(403)
      .json({ error: 'Forbidden: Not allowed to restore this user' });
  }

  try {
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.canRestore && !isAdmin) {
      return res.status(403).json({
        error: 'Account was disabled by an admin and cannot be restored',
      });
    }

    user.isDeleted = false;
    user.deletedAt = null;

    if (isAdmin) {
      user.canRestore = true;
    }

    await user.save();

    await logActivity({
      userId: req.user._id,
      action: 'restore_user',
      req,
      details: { restoredUserId: user._id },
    });

    return res
      .status(200)
      .json({ message: 'User restored successfully', data: user });
  } catch (error) {
    console.error('Restore user error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// GET USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).select(
      'username email createdAt'
    );

    await logActivity({
      userId: req.user._id,
      action: 'get_users',
      req,
    });

    res.status(200).json({ data: users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
