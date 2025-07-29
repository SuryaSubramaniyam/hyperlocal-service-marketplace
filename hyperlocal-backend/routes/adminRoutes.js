import express from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import {
  getAllUsers,
  getAllProviders,
  getAllServices,
  getAllBookings,
  getAdminStats,
} from "../controllers/adminController.js";

import {
  toggleBlockUser,
  promoteUserToProvider,
  toggleProviderActive,
  toggleServiceApproval,
  deleteService,
} from "../controllers/adminController.js";

import authenticate, { Authorize } from "../middleware/authMiddleware.js";
import Booking from "../models/Booking.js";
const router = express.Router();
router.use(authenticate, Authorize("admin"));

// categories
router.get("/categories", getAllCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// admin-specific
router.get("/users", getAllUsers);
router.get("/providers", getAllProviders);
router.get("/services", getAllServices);
router.get("/bookings", getAllBookings);



// backend routes/adminRoutes.js or general routes

router.get("/stats", getAdminStats);


// Toggle block/unblock user
router.patch("/users/:id/toggle", toggleBlockUser);

// Promote user to provider
router.patch("/users/:id/promote", promoteUserToProvider);

// Toggle approve/deactivate provider
router.patch("/providers/:id/toggle", toggleProviderActive);

// Toggle approve/unapprove service
router.patch("/services/:id/approve", toggleServiceApproval);


// Delete service
router.delete("/services/:id", deleteService);

 router.get("/bookings", getAllBookings);
export default router;
