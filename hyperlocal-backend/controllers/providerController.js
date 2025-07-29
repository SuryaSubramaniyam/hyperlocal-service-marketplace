import { User } from "../models/User.js";

export const updateProviderProfile = async (req, res) => {
  try {
    const { name, email, phone, profileImage } = req.body;

    const user = await User.findById(req.params.id);
    if (!user || user.role !== "provider") {
      return res.status(404).json({ message: "Provider not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.profileImage = profileImage || user.profileImage;

    await user.save();
    res.json({ message: "Provider profile updated", user });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: err.message });
  }
};
