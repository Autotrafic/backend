import { Schema, Document, model } from "mongoose";
import { ISessionLog } from "../SessionLog/SessionLog";

export interface IUserLogs extends Document {
    userId: string;
    sessionLogs: ISessionLog[];
}

const UserLogsSchema = new Schema({
    userId: { type: String, required: true },
    sessionLogs: [{ type: Schema.Types.ObjectId, ref: "SessionLog" }],
});

export const UserLogs = model<IUserLogs>(
    "UserLogs",
    UserLogsSchema,
    "user-logs"
);
