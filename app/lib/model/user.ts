// models/User.ts
import mongoose, { Document, Model } from 'mongoose';

// Define interface for User document
export interface IUser extends Document {
  email: string | null;
  password: string | null;
}

// Define schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String
  }
}, {
  timestamps: true
});

// Create or retrieve model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;