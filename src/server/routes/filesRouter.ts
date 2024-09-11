import express from "express";
import multer from "multer";
import {
  uploadFiles,
  createAdditionalInformationFile,
} from "../controllers/filesController";

const filesRouter = express.Router();

const upload = multer({ limits: { fileSize: 3000000 }, dest: "uploads/" });

filesRouter.post("/upload", upload.any(), uploadFiles);
filesRouter.post("/create-information-file", createAdditionalInformationFile);

export default filesRouter;
