import { Request, Response, NextFunction } from "express";
import {
  uploadStreamFileToDrive as uploadToGoogleDrive,
  getOrderFolder,
  uploadAdditionalInformationFile,
} from "../services/googleDrive";
import { EXPEDIENTES_DRIVE_FOLDER_ID } from "../../utils/constants";
import CustomError from "../../errors/CustomError";
import { CreateInformationFileBody } from "../../interfaces/import/file";

export async function uploadFiles(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const files = req.files as Express.Multer.File[];
  const { folderName } = req.body;

  if (!files || files.length === 0) {
    res.status(400).send(`No file uploaded. Files: ${files}`);
    return;
  }

  try {
    const orderFolderId = await getOrderFolder(
      folderName,
      EXPEDIENTES_DRIVE_FOLDER_ID
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      // eslint-disable-next-line no-await-in-loop
      await uploadToGoogleDrive(file, orderFolderId);
    }

    res.status(200).json({ folderId: orderFolderId });
  } catch (error) {
    console.error("Error uploading files to Google Drive:", error);
    const finalError = new CustomError(
      500,
      `Failed to upload files to Google Drive. \n ${error}`,
      `Failed to upload files to Google Drive. \n ${error}`
    );
    next(finalError);
  }
}

export async function createAdditionalInformationFile(
  req: CreateInformationFileBody,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { orderData, folderName } = req.body;

  try {
    const orderFolderId = await getOrderFolder(
      folderName,
      EXPEDIENTES_DRIVE_FOLDER_ID
    );

    await uploadAdditionalInformationFile(orderData, orderFolderId);

    res.status(200).json({ folderId: orderFolderId });
  } catch (error) {
    console.error("Error uploading files to Google Drive:", error);
    const finalError = new CustomError(
      500,
      `Failed to upload additional information file to Google Drive. \n ${error}`,
      `Failed to upload additional information file to Google Drive. \n ${error}`
    );
    next(finalError);
  }
}
