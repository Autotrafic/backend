import mongoose, { Schema, Document } from "mongoose";
import { IActivityLog } from "../ActivityLog/ActivityLog";

export interface ISessionLog extends Document {
    sessionId: string;
    userId: string;
    startTime: Date;
    activityLogs: IActivityLog[];
}

const SessionLogSchema = new Schema({
    sessionId: { type: String, required: true },
    userId: { type: String, required: true },
    startTime: { type: Date, required: true },
    activityLogs: [{ type: Schema.Types.ObjectId, ref: "ActivityLog" }],
});

export const SessionLog = mongoose.model<ISessionLog>(
    "SessionLog",
    SessionLogSchema,
    "session-logs"
);
