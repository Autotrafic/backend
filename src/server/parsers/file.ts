import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import axios from 'axios';

export async function bufferToBase64(buffer: Buffer) {
  return buffer.toString('base64');
}

export async function parsePdfUrlToBase64(pdfUrl: string) {
  try {
    const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });

    const base64 = Buffer.from(response.data, 'binary').toString('base64');

    return base64;
  } catch (error) {
    throw new Error(`Error parseando la url del pdf a base 64: ${error.message}`);
  }
}

export function parseBase64ToPDFFile(base64Data: string, fileNameWithoutExtension: string): Promise<Express.Multer.File> {
  return new Promise((resolve, reject) => {
    try {
      const base64String = base64Data.split(';base64,').pop();
      const completeFileName = `${fileNameWithoutExtension}_${nanoid(8)}.pdf`;

      if (!base64String) {
        throw new Error('Failed to parse base 64 to PDF file: Invalid base64 data.');
      }

      if (!fs.existsSync('uploads/')) {
        fs.mkdirSync('uploads/', { recursive: true });
      }

      const filePath = path.join('uploads/', completeFileName);
      const buffer = Buffer.from(base64String, 'base64');

      fs.writeFile(filePath, buffer, (error) => {
        if (error) {
          reject(`Error writing file: ${error}`);
        } else {
          const fileDetails: Express.Multer.File = {
            path: filePath,
            originalname: completeFileName,
            mimetype: 'application/pdf',
            filename: completeFileName,
            size: buffer.length,
            buffer: buffer,
            fieldname: '',
            encoding: '7bit',
            destination: 'uploads/',
            stream: fs.createReadStream(filePath),
          };
          resolve(fileDetails);
        }
      });
    } catch (error) {
      reject(`Error parsing base64 to file: ${error}`);
    }
  });
}

export async function mergePdfFromBase64Strings(base64Strings: string[]): Promise<string> {
  const mergedPdf = await PDFDocument.create();

  for (const base64String of base64Strings) {
    const pdfBytes = Buffer.from(base64String, 'base64');
    const pdf = await PDFDocument.load(pdfBytes);

    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  const mergedPdfBytes = await mergedPdf.save();

  const mergedPdfBase64 = Buffer.from(mergedPdfBytes).toString('base64');

  return mergedPdfBase64;
}
