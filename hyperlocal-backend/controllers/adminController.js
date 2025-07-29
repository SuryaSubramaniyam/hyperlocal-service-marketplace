import { User } from "../models/User.js";
import { Service } from "../models/Service.js";
import Booking from "../models/Booking.js";


export const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" });
  res.json(users);
};


export const getAllProviders = async (req, res) => {
const providers = await User.find({ role: "provider" });
  res.json(providers);
};


export const getAllServices = async (req, res) => {
  const services = await Service.find().populate("provider", "name");
  res.json(services);
};




// In controllers/adminController.js or similar

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("provider", "name email")
      .populate("services", "title price") // ✅ Make sure 'price' is included
      .sort({ createdAt: -1 });

    // ✅ Add this line to inspect populated services
    // console.log("Booking sample:", bookings[0]?.services);

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};





export const toggleBlockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.blocked = !user.blocked;
  await user.save();
  res.json(user);
};


export const promoteUserToProvider = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.role = "provider";
  await user.save();
  res.json(user);
};

export const toggleProviderActive = async (req, res) => {
  const provider = await User.findById(req.params.id); // same model
  provider.active = !provider.active;
  await provider.save();
  res.json(provider);
};


export const toggleServiceApproval = async (req, res) => {
  const { id } = req.params;
  let { approved } = req.body;

  try {
    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ error: "Service not found" });

    // Force approved to be a real boolean (from string or undefined)
    if (typeof approved === "string") {
      approved = approved === "true";
    } else if (typeof approved !== "boolean") {
      approved = !service.approved; // toggle fallback
    }

    service.approved = approved;
    await service.save();

    res.status(200).json(service); // Return updated doc
  } catch (err) {
    console.error("Error in toggleServiceApproval:", err);
    res.status(500).json({ error: "Failed to update approval" });
  }
};



export const deleteService = async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: "Service deleted" });
};



export const getAdminStats = async (req, res) => {
  const users = await User.countDocuments({ role: "user" });
 const providers = await User.countDocuments({ role: "provider" });

  const services = await Service.countDocuments();

  const revenue = await Booking.aggregate([
    {
      $group: {
        _id: { $substr: ["$date", 0, 7] }, 
        total: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ users, providers, services, revenue });
};
