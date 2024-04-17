import { Request, Response, NextFunction } from "express";
import { uploadFile as uploadToGoogleDrive } from "../services/googleDrive";
import CustomError from "../../errors/CustomError";

export const uploadFiles = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { files } = req;

    if (
        !files ||
        (Array.isArray(files) && files.length === 0) ||
        (typeof files === "object" && Object.keys(files).length === 0)
    ) {
        return res.status(400).send("No file uploaded.");
    }

    try {
        if (Array.isArray(files)) {
            for (const file of files) {
                await uploadToGoogleDrive(file);
            }
        } else {
            for (const key in files) {
                if (files.hasOwnProperty(key)) {
                    for (const file of files[key]) {
                        await uploadToGoogleDrive(file);
                    }
                }
            }
        }

        res.status(200).send({
            message: "Files uploaded successfully",
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
