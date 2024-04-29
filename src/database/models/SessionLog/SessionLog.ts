import mongoose, { Schema, Document } from "mongoose";
import { IActivityLog } from "../ActivityLog/ActivityLog";

export interface ISessionLog extends Document {
    sessionId: string;
    userId: string;
    timestamp: Date;
    activityLogs: IActivityLog[];
}

const SessionLogSchema = new Schema({
    sessionId: { type: String, required: true },
    userId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    activityLogs: [{ type: Schema.Types.ObjectId, ref: "ActivityLog" }],
});

export const SessionLog = mongoose.model<ISessionLog>(
    "SessionLog",
    SessionLogSchema,
    "session-logs"
);
