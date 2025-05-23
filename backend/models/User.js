import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      trim: true,
      required: [true, 'Username is required'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
