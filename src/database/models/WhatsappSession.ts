import mongoose, { Schema, model } from "mongoose";

interface ISession extends Document {
    _id: string;
    data: Record<string, unknown>;
}

const whatsappSessionSchema = new Schema({
    _id: String,
    data: Object,
});

const WhatsappSession = model<ISession>(
    "WhatsappSession",
    whatsappSessionSchema,
    "whatsapp-sessions"
);

export { ISession, WhatsappSession, mongoose };
