import express from 'express';
import authenticate, {Authorize} from '../middleware/authMiddleware.js';
import { bookService, getUserBookings, getProviderBookings, updateBookingStatus, createBooking } from '../controllers/bookingController.js';



const router = express.Router();

// book  a service for this routes
// router.post('/', authenticate, bookService);
// view a bookings for User
// router.post("/", authenticate, createBooking);
router.post("/", authenticate, Authorize("user"), createBooking);

router.get('/user', authenticate, getUserBookings);
// view bookings for provider
// router.get('/provider', authenticate, getProviderBookings);
router.get(
  "/provider",
  authenticate,
  Authorize("provider"),
  getProviderBookings
); 

// router.patch("/:bookingId/status", authenticate, updateBookingStatus);
router.patch("/:bookingId/status", authenticate, Authorize("provider"), updateBookingStatus);

// this is for update booking routes
// router.put('/:bookingId/status', authenticate, updateBookingStatus);

export default router;