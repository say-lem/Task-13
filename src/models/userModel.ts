import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../interfaces/userInterface";

interface IUserDocument extends Omit<IUser, "id">, Document {}


const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUserDocument>("User", UserSchema);
