import express from "express";
import {
    getAllUserLogs,
    getSessionLogsFromUserId,
    getActivityLogsFromSessionId,
    logActivity,
} from "../controllers/loggerController";

const logRouter = express.Router();

logRouter.get("/", getAllUserLogs);
logRouter.get("/user/:userId", getSessionLogsFromUserId);
logRouter.get("/session/:userId", getActivityLogsFromSessionId);
logRouter.post("/register", logActivity);

export default logRouter;
