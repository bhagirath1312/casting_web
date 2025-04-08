import mongoose from 'mongoose';

const CastingSchema = new mongoose.Schema({
  title: String,
  description: String,
  age: String,
  location: String,
  phone: String,
  company: String,
  imageUrl: String,
}, { timestamps: true });

export default mongoose.models.Casting || mongoose.model('Casting', CastingSchema);