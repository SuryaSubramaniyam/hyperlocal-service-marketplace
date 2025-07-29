import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  profileImage: String,
  role: {
    type: String,
    enum: ["user", "provider", "admin"],
    default: "user",
  },
  blocked: {
  type: Boolean,
  default: false
},
active: {
  type: Boolean,
  default: true 
}
});
export const User = mongoose.model("User", userSchema);
