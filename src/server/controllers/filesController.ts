import { Request, Response, NextFunction } from "express";
import {
    uploadStreamFileToDrive as uploadToGoogleDrive,
    createFolder,
} from "../services/googleDrive";
import { CUSTOMER_FILES_DRIVE_FOLDER_ID } from "../../utils/constants";
import CustomError from "../../errors/CustomError";
import { createTextFile, formatDataForTextFile } from "../../utils/file";

export default async function uploadFiles(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const files = req.files as Express.Multer.File[];
    const { orderData, folderName } = req.body;

    if (!files || files.length === 0) {
        res.status(400).send(`No file uploaded. Files: ${files}`);
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

        // eslint-disable-next-line no-restricted-syntax
        for (const file of files) {
            // eslint-disable-next-line no-await-in-loop
            await uploadToGoogleDrive(file, createdFolderId);
        }

        res.status(200).send({ message: "Files uploaded successfully" });
    } catch (error) {
        console.error("Error uploading files to Google Drive:", error);
        const finalError = new CustomError(
            500,
            "Failed to upload files to Google Drive.",
            `Failed to upload files to Google Drive. \n ${error}`
        );
        next(finalError);
    }
};
