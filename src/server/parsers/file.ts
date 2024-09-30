import { PDFDocument } from 'pdf-lib';

export async function bufferToBase64(buffer: Buffer) {
  return buffer.toString('base64');
}

export async function mergePdfFromBase64Strings(base64Strings: string[]) {
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
