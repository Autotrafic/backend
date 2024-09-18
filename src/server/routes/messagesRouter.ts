import express from "express";
import sendSlackMessage from "../controllers/notifierController";

const messagesRouter = express.Router();

messagesRouter.post("/slack", sendSlackMessage);

export default messagesRouter;
