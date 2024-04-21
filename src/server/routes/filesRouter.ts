import express from "express";
import multer, { FileFilterCallback } from "multer";
import csrf from "csurf";
import { uploadFiles } from "../controllers/filesController";

const filesRouter = express.Router();

const csrfProtection = csrf({ cookie: true });

const upload = multer({ dest: "uploads/" });

filesRouter.post("/upload", csrfProtection, upload.any(), uploadFiles);

export default filesRouter;
