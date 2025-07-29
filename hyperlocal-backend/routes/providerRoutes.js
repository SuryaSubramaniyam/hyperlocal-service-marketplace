import express from "express";
import { User } from "../models/User.js";
import { updateProviderProfile } from "../controllers/providerController.js";
import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/:id", async (req, res) => {
  
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user || user.role !== "provider") {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.put("/:id", authenticate, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    return updateProviderProfile(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
