import express from 'express';
import multer from 'multer';
import {
  uploadFiles,
  createAdditionalInformationFile,
  mergePdfBlobFiles,
  createPdfFromString,
  parseA6PdfToA4,
} from '../controllers/filesController';

const filesRouter = express.Router();

const upload = multer({ limits: { fileSize: 25000000 }, dest: 'uploads/' });

filesRouter.post('/upload', upload.any(), uploadFiles);
filesRouter.post('/parse-a6-to-a4', upload.single("file"),  parseA6PdfToA4);

filesRouter.post('/create-information-file', createAdditionalInformationFile);
filesRouter.post('/create-text-pdf', createPdfFromString);

filesRouter.post('/merge-pdf-blobs', mergePdfBlobFiles);


export default filesRouter;
