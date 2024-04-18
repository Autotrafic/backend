import express from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { uploadFiles } from "../controllers/filesController";

const filesRouter = express.Router();

const MAX_SIZE = 50 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const fileFilter = (
    req: express.Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (
        file.mimetype.startsWith("image/") ||
        file.mimetype === "text/plain" ||
        file.mimetype === "application/pdf" ||
        file.mimetype ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_SIZE },
    fileFilter: fileFilter,
});

filesRouter.post("/upload", upload.any(), uploadFiles);

export default filesRouter;
