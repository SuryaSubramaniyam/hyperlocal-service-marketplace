import express from 'express';
import { createService, getAllServices, getServiceById } from '../controllers/serviceController.js';
import authenticate, {Authorize} from '../middleware/authMiddleware.js';
import { Service } from "../models/Service.js";

const router = express.Router();

// router.post('/create', createService);
// router.post('/create',authenticate,Authorize('provider'),createService);
// router.get('/', getAllServices);
// /routes/serviceRoutes.js
router.post("/create", authenticate,Authorize("provider"),createService);
router.get("/", getAllServices);       // ✓ single handler
router.get("/:id", getServiceById);  
router.get("/locations", async (req, res) => {
  try {
    const locations = await Service.distinct("location");
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

  // new controller below

export default router;