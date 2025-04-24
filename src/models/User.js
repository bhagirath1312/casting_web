import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    height: { type: String }, // ✅ Added
  weight: { type: String }, 
    languages: { type: [String], required: true },
    mobile: { type: String, required: true },
    gender: { type: String, required: true },
    location: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" }, // ✅ Add this
  }, { timestamps: true });

  export default mongoose.models.User || mongoose.model("User", UserSchema);