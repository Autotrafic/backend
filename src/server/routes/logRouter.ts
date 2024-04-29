import express from "express";
import { getAllLogs, logActivity } from "../controllers/loggerController";

const logRouter = express.Router();

logRouter.get("/", getAllLogs);
logRouter.post("/register", logActivity);

export default logRouter;
