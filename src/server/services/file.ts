import { PDFDocument, rgb } from 'pdf-lib';

export async function createPdfFromStringLogic(content: string) {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([595, 842]);

  const { height } = page.getSize();

  const startY = height - 50;

  const lines = content.split('\n');
  const lineHeight = 14;

  lines.forEach((line: any, index: any) => {
    page.drawText(line, {
      x: 50,
      y: startY - index * lineHeight,
      size: 12,
      color: rgb(0, 0, 0),
    });
  });

  const pdfBytes = await pdfDoc.save();
  const base64Pdf = Buffer.from(pdfBytes).toString('base64');

  return base64Pdf;
}
