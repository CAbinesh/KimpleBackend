import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: false,
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true // ✅ adds createdAt & updatedAt automatically
  }
);

export default mongoose.model("Note", notesSchema);