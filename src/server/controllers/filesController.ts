import busboy from "busboy";
import { Request, Response, NextFunction } from "express";
import CustomError from "../../errors/CustomError";
import { createFolder, uploadStreamFileToDrive } from "../services/googleDrive";
import { CUSTOMER_FILES_DRIVE_FOLDER_ID } from "../../utils/constants";

export const uploadFiles = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, files } = req;
    const { folderName } = body;

    const bb = busboy({ headers: req.headers });
    let folderCreated = false;
    let createdFolderId: string | null = null;

    bb.on('file', async (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string, mimetype: string) => {
        if (!folderCreated) {
            createdFolderId = await createFolder(req.body.folderName, CUSTOMER_FILES_DRIVE_FOLDER_ID);
            folderCreated = true;
        }

        try {
            await uploadStreamFileToDrive({ stream: file, filename, mimetype }, createdFolderId!);
        } catch (error) {
            console.error("Error uploading files to Google Drive:", error);
            next(new CustomError(500, "Failed to upload file to Google Drive.", error.message));
            return;
        }
    });

    bb.on('finish', () => {
        res.status(200).send({ message: "Files uploaded successfully" });
    });

    req.pipe(bb);
};
