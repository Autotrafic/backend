import { NextFunction, Request, Response } from "express";
import CustomError from "../../errors/CustomError";
import { ActivityLog } from "../../database/models/ActivityLog/ActivityLog";
import { SessionLog } from "../../database/models/SessionLog/SessionLog";
import { UserLogs } from "../../database/models/UserLog/UserLog";

export const logActivity = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { message, sessionId, userId } = req.body;

        const newActivityLog = new ActivityLog({
            message: message,
            sessionId: sessionId,
            userId: userId,
            timestamp: new Date(),
        });

        await newActivityLog.save();

        let sessionLog = await SessionLog.findOne({ sessionId: sessionId });
        if (!sessionLog) {
            sessionLog = new SessionLog({
                sessionId: sessionId,
                userId: userId,
                startTime: newActivityLog.timestamp,
                activityLogs: [newActivityLog],
            });
            await sessionLog.save();
        } else {
            sessionLog.activityLogs.push(newActivityLog);
            await sessionLog.save();
        }

        let userLogs = await UserLogs.findOneAndUpdate(
            { userId: userId },
            { $set: { lastActivity: new Date() } },
            { new: true, upsert: true }
        );
        
        if (!userLogs) {
            userLogs = new UserLogs({
                userId: userId,
                sessionLogs: [sessionLog],
                lastActivity: new Date(),
            });
            await userLogs.save();
        } else {
            const existingSessionLogs = await SessionLog.find({
                _id: { $in: userLogs.sessionLogs },
            });
            const sessionExists = existingSessionLogs.some(
                (log) => log.sessionId === sessionId
            );
            if (!sessionExists) {
                userLogs.sessionLogs.push(sessionLog._id);
                await userLogs.save();
            }
        }

        res.status(200).json({
            success: true,
            message: "Activity logged successfully",
        });
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

export const getUserLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const logs = await UserLogs.find({});
        res.status(200).json(logs);
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error loading brands.",
            "Error loading brands."
        );
        next(finalError);
    }
};
