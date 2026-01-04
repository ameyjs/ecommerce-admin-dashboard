import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  role: {
    type: String,
    default: "admin", // We assume everyone logging in here is an admin
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);