import express from "express";
import { sendMessage } from "../controllers/whatsappController";

const messagesRouter = express.Router();

messagesRouter.post("/first-touch-whtspp", sendMessage);

export default messagesRouter;
