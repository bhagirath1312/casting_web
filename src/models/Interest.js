import mongoose from "mongoose";

const InterestSchema = new mongoose.Schema(
  {
    castingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Casting",
      required: true,
    },
    name: String,
    email: String,
    age: Number,
    location: String,
    height: String,
    weight: String,
    photoUrls: [String], // ✅ fixed key
    videoUrls: [String], // ✅ fixed key
  },
  { timestamps: true }
);

export default mongoose.models.Interest || mongoose.model("Interest", InterestSchema);


//not worked