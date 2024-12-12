import { Response } from 'express';
import { ExtendedTotalumShipment } from '../../interfaces/totalum/envio';
import { sleep } from '../../utils/funcs';
import { makeShipment, progressMap, temporaryStorage } from '../handlers/shipment';
import { mergePdfFromBase64Strings } from '../parsers/file';
import { getExtendedShipmentById } from '../services/totalum';

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

export async function processShipmentsBatch(
  requestId: string,
  shipments: ExtendedTotalumShipment[],
  numberOfShipments: number,
  isTest: boolean
): Promise<void> {
  for (const shipment of shipments) {
    try {
    const label = await makeShipment({ totalumShipment: shipment, isTest });
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
