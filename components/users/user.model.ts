import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
interface Location {
  type: string;
  coordinates: [number];
}

interface UserDoc {
  userName: string;
  email: string;
  firstName: String;
  lastName: String;
  password: string;
  createdAt: Date;
  tokens: Array<any>;
  socialLogin: Boolean,
  language: string;
  socialLoginObject: Object
  address: string;
  location: Location;
  birthDate: Date;
  mobileNumber: string;
  state: string;
  city: string;
  address2: string;
  isActive: Boolean;
  isDeleted: Boolean;
  isBlocked: Boolean;
  loginOtp: Number;
  confirmPassword(password: string): Promise<boolean>;
}
const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],

  },
  coordinates: {
    type: [Number],

  },
});

const UserSchema = new Schema<UserDoc>({
  userName: { type: String },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  tokens: [{ createdAt: Date, token: String }],
  email: { type: String },
  password: { type: String },
  socialLogin: { type: Boolean, default: false },
  language: { type: String, default: 'en' },
  socialLoginObject: { type: Object },
  address: { type: String, required: false },
  location: pointSchema,
  birthDate: { type: Date, default: Date.now() },
  mobileNumber: { type: String, required: true },
  state: { type: String, default: null },
  city: { type: String, default: null },
  address2: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  loginOtp: { type: Number, default: 0 }
}, {
  timestamps: true,
})

UserSchema.pre('save', async function () {
  let user = this as UserDoc;
  if (user.password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash
  }
});
UserSchema.index({ location: '2dsphere' });
UserSchema.methods.confirmPassword = async function (password: string) {
  const user = this as UserDoc;
  return bcrypt.compare(password, user.password);
};

const User = model<UserDoc>('Users', UserSchema);

export default User;
