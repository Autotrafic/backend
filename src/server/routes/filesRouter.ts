import express from "express";
import multer from "multer";
import path from 'path';
import { uploadFiles } from "../controllers/filesController";

const filesRouter = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

filesRouter.post("/upload", upload.any(), uploadFiles);

export default filesRouter;
