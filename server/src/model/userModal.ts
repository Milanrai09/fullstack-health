import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUserMethods {
  isLocalAuth(): boolean;
}

interface IUser extends Document, IUserMethods {
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  googleId?: string;
  picture?: string;
  authProvider: 'local' | 'google';
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function(this: IUser) { return this.authProvider === 'local'; },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  picture: {
    type: String,
  },
  authProvider: {
    type: String,
    required: true,
    enum: ['local', 'google'],
    default: 'local',
  },
});

UserSchema.methods.isLocalAuth = function() {
  return this.authProvider === 'local';
};

UserSchema.pre<IUser>('save', async function(next) {
  if (this.isModified('password') && this.isLocalAuth() && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model<IUser, UserModel>('User', UserSchema);

export default User;