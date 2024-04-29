import express from "express";
import { logActivity } from "../controllers/loggerController";

const logRouter = express.Router();

logRouter.post("/register", logActivity);

export default logRouter;
