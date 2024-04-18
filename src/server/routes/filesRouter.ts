import express from "express";
import { uploadFiles } from "../controllers/filesController";

const filesRouter = express.Router();

filesRouter.post("/upload", uploadFiles);

export default filesRouter;
