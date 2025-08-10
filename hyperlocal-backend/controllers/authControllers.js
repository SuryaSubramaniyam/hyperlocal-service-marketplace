import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

const sendTokenCookie = (res, user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return token;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, type, role = 'user' } = req.body;

    if (!['user', 'provider', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, type, role });

    await user.save();

    // ✅ Send cookie after registration
    sendTokenCookie(res, user);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: user.type
      }
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (user.blocked) {
      return res.status(403).json({ message: "Your account has been blocked by the admin." });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: `Access denied for ${role}` });
    }

    // ✅ Send cookie after login
    sendTokenCookie(res, user);

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    if (req.user._id.toString() !== id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: err.message });
  }
};
