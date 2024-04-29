import mongoose, { Schema, Document } from "mongoose";
import { IActivityLog } from "../ActivityLog/ActivityLog";

interface ISessionLog extends Document {
    sessionId: string;
    startTime: Date;
    activityLogs: IActivityLog[];
}

const SessionLogSchema = new Schema({
    sessionId: { type: String, required: true },
    startTime: { type: Date, required: true },
    activityLogs: [{ type: Schema.Types.ObjectId, ref: "ActivityLog" }],
});

const SessionLog = mongoose.model<ISessionLog>(
    "SessionLog",
    SessionLogSchema,
    "session-logs"
);
export default SessionLog;
