import express from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { uploadFiles } from "../controllers/filesController";

const filesRouter = express.Router();

const MAX_SIZE = 50 * 1024 * 1024;

const upload = multer({ dest: 'uploads/' });

filesRouter.post("/upload", upload.any(), uploadFiles);

export default filesRouter;
