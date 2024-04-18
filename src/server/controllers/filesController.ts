import { Request, Response, NextFunction } from "express";
import {
    uploadStreamFileToDrive as uploadToGoogleDrive,
    createFolder,
} from "../services/googleDrive";
import { CUSTOMER_FILES_DRIVE_FOLDER_ID } from "../../utils/constants";
import CustomError from "../../errors/CustomError";
import { createTextFile, formatDataForTextFile } from "../../utils/file";

export const uploadFiles = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    console.log('inside');
    const files = req.files as Express.Multer.File[];
    const { orderData, folderName } = req.body;

    if (!files || files.length === 0) {
        res.status(400).send("No file uploaded.");
        return;
    }

    try {
        const createdFolderId = await createFolder(
            folderName,
            CUSTOMER_FILES_DRIVE_FOLDER_ID
        );

        const orderDataFile = await createTextFile(
            formatDataForTextFile(orderData)
        );

        await uploadToGoogleDrive(
            orderDataFile as Express.Multer.File,
            createdFolderId
        );

        for (const file of files) {
            await uploadToGoogleDrive(file, createdFolderId);
        }

        res.status(200).send({ message: "Files uploaded successfully" });
    } catch (error) {
        console.error("Error uploading files to Google Drive:", error);
        const finalError = new CustomError(
            500,
            "Failed to upload file to Google Drive.",
            "Failed to upload file to Google Drive."
        );
        next(finalError);
    }
};
