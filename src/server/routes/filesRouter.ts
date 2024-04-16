import express from "express";
import { handleFileUpload } from "../controllers/filesController";

const filesRouter = express.Router();

filesRouter.post("/upload", handleFileUpload);

export default filesRouter;
