import express from "express";
import multer from "multer";
import { uploadFiles } from "../controllers/filesController";

const filesRouter = express.Router();
const upload = multer();

filesRouter.post("/upload", upload.any(), uploadFiles);

export default filesRouter;
