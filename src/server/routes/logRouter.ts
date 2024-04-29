import express from "express";
import {
    getAllUserLogs,
    getSessionLogsFromUserId,
    logActivity,
} from "../controllers/loggerController";

const logRouter = express.Router();

logRouter.get("/", getAllUserLogs);
logRouter.get("/user/:userId", getSessionLogsFromUserId);
logRouter.post("/register", logActivity);

export default logRouter;
