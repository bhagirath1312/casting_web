import mongoose from 'mongoose';

const CastingSchema = new mongoose.Schema({
  title: String,
  description: String,
  age: String,
  location: String,
  phone: String,
  company: String,
  imageUrl: String,
  projectLinks: {
    type: [String], // Array of strings
    default: [],
  },
}, { timestamps: true });

export default mongoose.models.Casting || mongoose.model('Casting', CastingSchema);