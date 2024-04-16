import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { uploadFile as uploadToGoogleDrive } from "../services/googleDrive";
import CustomError from "../../errors/CustomError";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadFiles = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    try {
        const fileId = await uploadToGoogleDrive(req.file);
        res.status(200).send({
            message: "File uploaded successfully",
            fileId: fileId,
        });
    } catch (error) {
        console.error("Error uploading file to Google Drive:", error);
        const finalError = new CustomError(
            500,
            "Failed to upload file to Google Drive.",
            "Failed to upload file to Google Drive."
        );
        next(finalError);
    }
};

export const handleFileUpload = [upload.single("file"), uploadFiles];
