import { NextFunction, Request, Response } from 'express';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import CustomError from '../../errors/CustomError';
import sseClientManager from '../../sse/sseClientManager';
import { getExtendedOrderById } from '../services/totalum';
import { generateTextByOrderFailedChecks } from '../handlers/order';
import { searchRegexInWhatsappChat } from '../services/notifier';
import fs from 'fs';
import { degrees, PDFDocument } from 'pdf-lib';

const totalumSdk = new TotalumApiSdk(totalumOptions);

interface Order extends TotalumOrder {
  socio_profesional: string;
}

export async function runScript(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    const fileBuffer = fs.readFileSync(req.file.path);

    const pdfDoc = await PDFDocument.load(fileBuffer);

    const newPdf = await PDFDocument.create();

    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;

    for (const page of pdfDoc.getPages()) {
      const { width, height } = page.getSize();

      const a4Page = newPdf.addPage([A4_WIDTH, A4_HEIGHT]);

      const embeddedPage = await newPdf.embedPage(page);

      const rotation = degrees(90);

      const x = height;
      const y = A4_HEIGHT - width;

      a4Page.drawPage(embeddedPage, {
        x,
        y,
        width,
        height,
        rotate: rotation,
      });
    }

    const pdfBytes = await newPdf.save();

    fs.unlinkSync(req.file.path);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=converted.pdf',
    });

    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error processing the file:', error);
    res.status(500).send('Error processing the file');
  }
}

export async function runSecondScript(req: Request, res: Response, next: NextFunction) {
  try {
    const message = 'Thisis fucking awesome';

    sseClientManager.broadcast('data', { text: message });

    res.status(200).send('Message broadcasted to all connected clients');
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error generating invoices.',
      `Error generating invoices.
      ${error}.`
    );
    next(finalError);
  }
}
