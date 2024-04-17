import { Request, Response, NextFunction } from "express";
import {
    createFolder,
    uploadFile as uploadToGoogleDrive,
} from "../services/googleDrive";
import CustomError from "../../errors/CustomError";
import { CUSTOMER_FILES_DRIVE_FOLDER_ID } from "../../utils/constants";
import { createTextFile, formatDataForTextFile } from "../../utils/file";

export const uploadFiles = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, files } = req;
    const { orderData, folderName } = body;

    if (
        !files ||
        (Array.isArray(files) && files.length === 0) ||
        (typeof files === "object" && Object.keys(files).length === 0)
    ) {
        return res.status(400).send("No file uploaded.");
    }

    try {
        const createdFolderId = await createFolder(
            folderName,
            CUSTOMER_FILES_DRIVE_FOLDER_ID
        );

        const orderDataFile = createTextFile(formatDataForTextFile(orderData));

        await uploadToGoogleDrive(orderDataFile, createdFolderId);

        if (Array.isArray(files)) {
            for (const file of files) {
                await uploadToGoogleDrive(file, createdFolderId);
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
