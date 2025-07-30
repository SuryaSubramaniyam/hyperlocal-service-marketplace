import express from 'express';
import { register, login, updateUser } from '../controllers/authControllers.js';
import authenticate, { Authorize } from '../middleware/authMiddleware.js';
import { updateProviderProfile } from "../controllers/providerController.js";
import { User } from '../models/User.js';
// ✅ Corrected import

const router = express.Router();

// Auth Routes
router.post('/register', register);
router.post('/login', login);

// Authenticated User
router.get('/user', authenticate, (req, res) => {
  res.json({ message: 'Welcome Authenticated User' });
});

// Admin Only
router.get('/admin', authenticate, Authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin User' });
});

// Register as Provider (reuses register controller)
router.post('/register/provider', async (req, res) => {
  req.body.role = 'provider';
  return register(req, res);
});

// Get User by ID (secured route)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("GET /:id failed", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Routes (separated for user and provider)
router.put("/user/:id", authenticate, updateUser);
router.put("/provider/:id", authenticate, updateProviderProfile);

export default router;
