import mongoose from "mongoose";

const castingInterestSchema = new mongoose.Schema({
  castingId: { type: mongoose.Schema.Types.ObjectId, ref: "Casting" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  email: String,
  age: Number,
  location: String,
  languages: { type: [String]},
  height: { type: String }, // ✅ Added
  weight: { type: String }, 
  projectLinks: {
    type: [String], // Array of strings
    default: [],
  },
  photoUrls: [String], // ✅ fixed key
  videoUrls: [String], // ✅ fixed key
});

export default mongoose.models.CastingInterest || mongoose.model("CastingInterest", castingInterestSchema);