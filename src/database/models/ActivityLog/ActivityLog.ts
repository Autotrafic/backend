import { Schema, Document, model } from "mongoose";

export interface IActivityLog extends Document {
    message: string;
    sessionId: string;
    timestamp: Date;
}

const ActivityLogSchema = new Schema({
    message: { type: String, required: true },
    sessionId: { type: String, required: true },
    timestamp: { type: Date, required: true },
});

export const ActivityLog = model<IActivityLog>(
    "ActivityLog",
    ActivityLogSchema,
    "activity-logs"
);
