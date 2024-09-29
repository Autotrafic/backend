import express from 'express';
import multer from 'multer';
import { uploadFiles, createAdditionalInformationFile, mergePdfBlobFiles, createPdfFromString } from '../controllers/filesController';

const filesRouter = express.Router();

const upload = multer({ limits: { fileSize: 25000000 }, dest: 'uploads/' });

filesRouter.post('/upload', upload.any(), uploadFiles);

filesRouter.post('/create-information-file', createAdditionalInformationFile);
filesRouter.post('/create-text-pdf', createPdfFromString);

filesRouter.post('/merge-pdf-blobs', upload.any(), mergePdfBlobFiles);

export default filesRouter;
