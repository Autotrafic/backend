import express from "express";
import sendMessage from "../controllers/whatsappController";
import sendSlackMessage from "../controllers/notifierController";

const messagesRouter = express.Router();

messagesRouter.post("/first-touch-whtspp", sendMessage);
messagesRouter.post("/slack", sendSlackMessage);

export default messagesRouter;
