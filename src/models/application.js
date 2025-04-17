import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    castingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Casting',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Optional if you're tracking which user applied
    },
    message: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);