import { NextFunction, Request, Response } from "express";
import CustomError from "../../errors/CustomError";
import { ActivityLog } from "../../database/models/ActivityLog/ActivityLog";
import SessionLog from "../../database/models/SessionLog/SessionLog";

export const logActivity = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { message, sessionId } = req.body;

        const newActivityLog = new ActivityLog({
            message: message,
            sessionId: sessionId,
            timestamp: new Date()
        });

        await newActivityLog.save();

        let sessionLog = await SessionLog.findOne({ sessionId: sessionId });
        if (!sessionLog) {
            sessionLog = new SessionLog({
                sessionId: sessionId,
                startTime: newActivityLog.timestamp,
                activityLogs: [newActivityLog]
            });
            await sessionLog.save();
        } else {
            sessionLog.activityLogs.push(newActivityLog);
            await sessionLog.save();
        }

        res.status(200).json({ success: true, message: "Activity logged successfully" });
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error logging activity.",
            "Error logging activity."
        );
        next(finalError);
    }
};
