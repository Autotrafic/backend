import "../../loadEnvironment";
import { NextFunction, Request, Response } from "express";
import CustomError from "../../errors/CustomError";
import { ActivityLog } from "../../database/models/ActivityLog/ActivityLog";
import { SessionLog } from "../../database/models/SessionLog/SessionLog";
import { UserLogs } from "../../database/models/UserLog/UserLog";

const ipdataKey = process.env.IPDATA_API_KEY;

export const logActivity = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { message, sessionId, region } = req.body;

        const userIP =
            (req.headers["x-forwarded-for"] as string) ||
            req.connection.remoteAddress;

        const newActivityLog = new ActivityLog({
            message: message,
            sessionId: sessionId,
            userId: userIP,
            timestamp: new Date(),
        });

        await newActivityLog.save();

        let sessionLog = await SessionLog.findOne({ sessionId: sessionId });
        if (!sessionLog) {
            sessionLog = new SessionLog({
                sessionId: sessionId,
                userId: userIP,
                timestamp: newActivityLog.timestamp,
                activityLogs: [newActivityLog],
            });
            await sessionLog.save();
        } else {
            sessionLog.activityLogs.push(newActivityLog);
            await sessionLog.save();
        }

        let userLogs = await UserLogs.findOneAndUpdate(
            { userId: userIP },
            { $set: { lastActivity: new Date(), CCAA: region } },
            { new: true, upsert: true }
        );

        if (!userLogs) {
            userLogs = new UserLogs({
                userId: userIP,
                sessionLogs: [sessionLog],
                lastActivity: new Date(),
                CCAA: region,
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
                userLogs.sessionLogs.push(sessionLog);
                await userLogs.save();
            }
        }

        res.status(201).json({
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

export const getAllUserLogs = async (
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
            "Error loading logs.",
            "Error loading logs."
        );
        next(finalError);
    }
};

export const getSessionLogsFromUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.params;

        const sessionLogs = await SessionLog.find({ userId: userId });
        res.status(200).json(sessionLogs);
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error loading logs.",
            "Error loading logs."
        );
        next(finalError);
    }
};

export const getActivityLogsFromSessionId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { sessionId } = req.params;

        const activityLogs = await ActivityLog.find({ sessionId: sessionId });
        res.status(200).json(activityLogs);
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error loading logs.",
            "Error loading logs."
        );
        next(finalError);
    }
};
