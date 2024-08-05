import { Schema, model, Document } from 'mongoose';

interface IReferral extends Document {
  id: string;
  source: string;
  createdAt: Date;
  expiresAt: Date;
}

const referralSchema = new Schema<IReferral>({
  id: { type: String, required: true, unique: true },
  source: { type: String, required: true, unique: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

const Referral = model<IReferral>('Referral', referralSchema, 'referrals');

export default Referral;