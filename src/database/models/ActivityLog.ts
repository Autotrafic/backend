import { Schema, Document, model } from 'mongoose';

const dayLogSchema = new Schema({
  day: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

const monthLogSchema = new Schema({
  month: {
    type: String,
    required: true,
  },
  days: [dayLogSchema],
});

export const WhatsappCount = model('WhatsappCount', monthLogSchema, 'whatsapp-count');

export const WebConsultCount = model('WebConsultCount', monthLogSchema, 'web-consult-count');
