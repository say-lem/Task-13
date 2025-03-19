import mongoose, { Schema, Document } from "mongoose";

interface INote extends Document {
  title: string;
  content: string;
  user: mongoose.Schema.Types.ObjectId;
  category: mongoose.Schema.Types.ObjectId; 
}

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<INote>("Note", NoteSchema);