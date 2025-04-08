// import mongoose from "mongoose";

// const castingInterestSchema = new mongoose.Schema({
//   castingId: String,
//   name: String,
//   email: String,
//   age: Number,
//   location: String,
//   height: String,
//   weight: String,
//   photoUrls: [String],
//   videoUrls: [String],
// }, { timestamps: true });

// export default mongoose.models.CastingInterest || mongoose.model("CastingInterest", castingInterestSchema);
// models/CastingInterest.js
import mongoose from "mongoose";

const castingInterestSchema = new mongoose.Schema({
  castingId: { type: mongoose.Schema.Types.ObjectId, ref: "Casting" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  email: String,
  age: Number,
  location: String,
  height: String,
  weight: String,
  photoUrls: [String], // ✅ fixed key
  videoUrls: [String], // ✅ fixed key
});

export default mongoose.models.CastingInterest || mongoose.model("CastingInterest", castingInterestSchema);