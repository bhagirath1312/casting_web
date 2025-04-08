import mongoose from "mongoose";

const CastingInterestSchema = new mongoose.Schema(
  {
    castingId: { type: String, required: true },
    name: String,
    email: String,
    age: Number,
    location: String,
    height: String,
    weight: String,
    photoUrls: [String],
    videoUrls: [String],
  },
  { timestamps: true }
);

export default mongoose.models.CastingInterest ||
  mongoose.model("CastingInterest", CastingInterestSchema);