import { Request, Response, NextFunction } from 'express';
import {
  uploadStreamFileToDrive as uploadToGoogleDrive,
  getOrderFolder,
  uploadAdditionalInformationFile,
} from '../services/googleDrive';
import { EXPEDIENTES_DRIVE_FOLDER_ID } from '../../utils/constants';
import CustomError from '../../errors/CustomError';
import { CreateInformationFileBody } from '../../interfaces/import/file';
import { PDFDocument } from 'pdf-lib';
import { createPdfFromStringLogic } from '../services/file';

export async function uploadFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
  const files = req.files as Express.Multer.File[];
  const { folderName } = req.body;

  if (!files || files.length === 0) {
    res.status(400).send(`No file uploaded. Files: ${files}`);
    return;
  }

  try {
    const orderFolderId = await getOrderFolder(folderName, EXPEDIENTES_DRIVE_FOLDER_ID);

    for (const file of files) {
      await uploadToGoogleDrive(file, orderFolderId);
    }

    res.status(200).json({ folderId: orderFolderId });
  } catch (error) {
    console.error('Error uploading files to Google Drive:', error);
    const finalError = new CustomError(
      500,
      `Failed to upload files to Google Drive. ${error}`,
      `Failed to upload files to Google Drive.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
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
    if (!folderName) throw new Error('No folder name provided');

    const orderFolderId = await getOrderFolder(folderName, EXPEDIENTES_DRIVE_FOLDER_ID);

    await uploadAdditionalInformationFile(orderData, orderFolderId);

    res.status(200).json({ folderId: orderFolderId });
  } catch (error) {
    console.error('Error uploading files to Google Drive:', error);
    const finalError = new CustomError(
      500,
      `Failed to upload additional information file to Google Drive.`,
      `Failed to upload additional information file to Google Drive.
      ${error}
      
      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}

export async function createPdfFromString(req: Request, res: Response, next: NextFunction) {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required to create PDF.' });
  }

  try {
    const base64Pdf = createPdfFromStringLogic(content);

    res.status(200).json({ pdf: base64Pdf });
  } catch (error) {
    console.error('Error creating PDF:', error);
    next(error);
  }
}

export async function mergePdfBlobFiles(req: Request, res: Response, next: NextFunction) {
  const { blobs } = req.body;

  try {
    const mergedPdf = await PDFDocument.create();

    for (const base64String of blobs) {
      const pdfBytes = Buffer.from(base64String, 'base64');
      const pdf = await PDFDocument.load(pdfBytes);

      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    const mergedPdfBytes = await mergedPdf.save();

    const mergedPdfBase64 = Buffer.from(mergedPdfBytes).toString('base64');

    res.status(201).json({ mergedPdf: mergedPdfBase64 });
  } catch (error) {
    console.error('Error merging pdf files:', error);
    const finalError = new CustomError(
      500,
      `Failed to merge pdf files.`,
      `Failed to merge pdf files.
      ${error}
      
      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}
