import { Response } from 'express';
import { ExtendedTotalumShipment, TotalumShipment } from '../../interfaces/totalum/envio';
import { sleep } from '../../utils/funcs';
import { makeShipment, progressMap, temporaryStorage } from '../handlers/shipment';
import { mergePdfFromBase64Strings } from '../parsers/file';
import { getExtendedShipmentById } from '../services/totalum';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export function initializeRequestContext(requestId: string, numberOfShipments: number): void {
  if (!progressMap[requestId]) {
    progressMap[requestId] = { progress: 0, total: numberOfShipments, processedCount: 0, message: '' };
  }

  if (!temporaryStorage[requestId]) {
    temporaryStorage[requestId] = [];
  }
}

export async function fetchAndCleanShipments(shipmentsId: string[]): Promise<ExtendedTotalumShipment[]> {
  const shipmentsPromises = shipmentsId.map((shipmentId) => getExtendedShipmentById(shipmentId));
  const shipments = await Promise.all(shipmentsPromises);
  return shipments.filter((shipment) => shipment !== undefined);
}

async function createPdfAsBase64WithDelay(text: string): Promise<string> {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
  
    // Add a blank page
    const page = pdfDoc.addPage([600, 400]);
  
    // Embed the standard font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
    // Define font size and color
    const fontSize = 24;
    const textColor = rgb(0, 0, 0);
  
    // Add text to the page
    page.drawText(text, {
      x: 50,
      y: 300,
      size: fontSize,
      font: font,
      color: textColor,
    });
  
    // Serialize the PDF document to bytes
    const pdfBytes = await pdfDoc.save();
  
    // Introduce a 3-second delay
    await sleep(3000);
  
    // Convert the bytes to a Base64 string
    const labelBase64 = Buffer.from(pdfBytes).toString('base64');
  
    return labelBase64;
  }

export async function processShipmentsBatch(
  requestId: string,
  shipments: ExtendedTotalumShipment[],
  numberOfShipments: number,
  isTest: boolean
): Promise<void> {
  for (const shipment of shipments) {
    try {
    //   const label = await makeShipment({ totalumShipment: shipment, isTest });
    const label = await createPdfAsBase64WithDelay('Here and now');
      temporaryStorage[requestId].push(label);

      progressMap[requestId].processedCount = (progressMap[requestId].processedCount || 0) + 1;
      progressMap[requestId].progress = Math.round((progressMap[requestId].processedCount / numberOfShipments) * 100);

      await sleep(500);
    } catch (error: any) {
      progressMap[requestId].message = `${error.message}`;
    }
  }
}

export async function handleLastBatch(requestId: string, res: Response): Promise<void> {
  const allLabelsBase64 = temporaryStorage[requestId];
  const mergedLabelsBase64 = await mergePdfFromBase64Strings(allLabelsBase64);

  delete temporaryStorage[requestId];

  res.status(200).json({ requestId, mergedLabelsBase64, message: 'All shipments processed and merged.' });
}
