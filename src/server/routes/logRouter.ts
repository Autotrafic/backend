import express from "express";
import { getUserLogs, logActivity } from "../controllers/loggerController";

const logRouter = express.Router();

logRouter.get("/", getUserLogs);
logRouter.post("/register", logActivity);

export default logRouter;
