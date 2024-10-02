import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function bufferToBase64(buffer: Buffer) {
  return buffer.toString('base64');
}

export function parseBase64ToPDFFile(base64Data: string, fileNameWithoutExtension: string) {
  try {
    const base64String = base64Data.split(';base64,').pop();
    const completeFileName = `${fileNameWithoutExtension}.pdf`;
    const filePath = path.join(__dirname, 'temp', completeFileName);

    // Ensure the 'temp' directory exists
    fs.mkdirSync(path.join(__dirname, 'temp'), { recursive: true });

    fs.writeFileSync(filePath, Buffer.from(base64String, 'base64'));

    return {
      path: filePath,
      originalname: completeFileName,
      mimetype: 'application/pdf',
      filename: filePath,
      size: Buffer.byteLength(base64String),
      buffer: Buffer.from(base64String, 'base64'),
      fieldname: '',
      encoding: '',
      destination: '',
      stream: fs.createReadStream(filePath),
    };
  } catch (error) {
    throw new Error(`Error parsing base64 to file: ${error}`);
  }
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
