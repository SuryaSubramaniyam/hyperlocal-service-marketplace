import Booking from "../models/Booking.js";
import { Service } from "../models/Service.js";
import { sendBookingEmail } from "../utils/sendEmail.js";
export const bookService =  async(req,res)=>{
    try {
        const { serviceId, date} = req.body;
        const service = await Service.findById(serviceId);

        if(!service)
            return res.status(404).json({error: 'Service Not found'});
        const booking = new Booking({ user: req.user.id, provider:service.provider,service: serviceId,date, status: "scheduled" });
        const saved = await booking.save();
        res.status(201).json(saved);
        
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};


export const getUserBookings = async(req, res) => {
    try {
      const bookings = await Booking.find({ user: req.user.id}).populate('services', 'title name category location price description').populate('provider', 'name');
      res.json(bookings);  
    } catch (err) {
        res.status(500).json({ error: err.message});
        
    };
    
}
export const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .populate("services", "name price")
      .populate("user", "name email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

const allowed = ["scheduled", "completed", "cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Failed to update booking status" });
  }
};


// bookingController.js

export const createBooking = async (req, res) => {
  try {
    const { services, address, phone, paymentMethod, paymentInfo } = req.body;
    const userId = req.user._id;

    if (!services || services.length === 0) {
      return res.status(400).json({ error: "No services selected" });
    }

    const firstService = await Service.findById(services[0]);
    if (!firstService) return res.status(404).json({ error: "Service not found" });

    const newBooking = await Booking.create({
      user: userId,
      services,
      provider: firstService.provider,
      address,
      phone,
      paymentMethod,
      paymentInfo,
    });

    // Fetch user's email and service details
    const bookedServices = await Service.find({ _id: { $in: services } });
    const totalAmount = bookedServices.reduce((sum, s) => sum + s.price, 0);
    const serviceTitles = bookedServices.map((s) => `<li>${s.title} - ₹${s.price}</li>`).join("");

    // ✅ Send Email
    await sendBookingEmail(
      req.user.email,
      "Your Booking is Confirmed!",
      `
        <h2>Hi ${req.user.name},</h2>
        <p>Your booking with <strong>Hyperlocal Services</strong> has been successfully confirmed.</p>
        <p><strong>Payment Method:</strong> ${paymentMethod === "razorpay" ? "Razorpay (Paid)" : "Cash on Delivery"}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Booked Services:</strong></p>
        <ul>${serviceTitles}</ul>
        <p><strong>Total:</strong> ₹${totalAmount}</p>
        <br/>
        <p>Thank you for choosing us!</p>
        <p>– Hyperlocal Team</p>
      `
    );

    res.status(201).json({ message: "Booking created", booking: newBooking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getAllBookings = async (req, res) => {
  try {
    
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("provider", "name email")
      .populate("services", "title price") // ✅ FIXED
// ✅ Add this line to include service price
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};