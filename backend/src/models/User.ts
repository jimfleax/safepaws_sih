import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  googleId: string;
  name: string;
  phone?: string;
  neighborhood?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notificationPrefs: string[];
  avatarUrl?: string;
  profileCompleted: boolean;
  tokenVersion: number;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String },
  neighborhood: { type: String },
  emergencyContactName: { type: String },
  emergencyContactPhone: { type: String },
  notificationPrefs: { type: [String], default: ['email'] },
  avatarUrl: { type: String },
  profileCompleted: { type: Boolean, default: false },
  tokenVersion: { type: Number, default: 0 }
});

export default mongoose.model<IUser>('User', userSchema);
