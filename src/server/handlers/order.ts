import { TotalumApiSdk } from 'totalum-api-sdk';
import { DatabaseOrder } from '../../database/models/Order/WebOrder';
import { EXPEDIENTES_DRIVE_FOLDER_ID, totalumOptions } from '../../utils/constants';
import { OrderDetailsBodyWithId, WhatsappOrder } from '../../interfaces/import/order';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import {
  parseClientFromDatabaseToTotalum,
  parseOrderDetailsFromDatabaseToTotalum,
  parseOrderFromWhatsappToTotalum,
  parseRelatedPersonClientFromDatabaseToTotalum,
  parseShipmentFromDatabaseToTotalum,
} from '../parsers/order';
import {
  createTotalumShipmentAndLinkToOrder,
  getClientById,
  getExtendedOrderById,
  getTotalumOrderFromDatabaseOrderId,
} from '../services/totalum';
import {
  CLIENT_FIELD_CONDITIONS,
  generateChecks,
  ORDER_FIELD_CONDITIONS,
  SHIPMENT_FIELD_CONDITIONS,
} from '../../utils/checks';
import { Check } from '../../interfaces/checks';
import { getOrderFolder, uploadStreamFileToDrive } from '../services/googleDrive';
import { createTextFile } from '../../utils/file';
import { parseClientFromWhatsappToTotalum, parseRelatedPersonFromWhatsappToTotalum } from '../parsers/client';
import { parseShipmentFromWhatsappToTotalum } from '../parsers/shipment';
import { getCurrentOrNextMonday } from '../../utils/funcs';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export async function generateTextByOrderFailedChecks(orderId: string): Promise<string> {
  try {
    const { orderChecks, clientChecks, shipmentChecks, relatedPersonChecks } = await checkTOrderCompletion(orderId);

    const formatFailedChecks = (entityName: string, checks: { failedChecks: Check[] }): string => {
      if (checks?.failedChecks?.length > 0) {
        const failedProps = checks.failedChecks
          .map((check) => check.propertyChecked)
          .filter(Boolean)
          .join(', ');

        return `- ${entityName} (${failedProps})`;
      } else {
        return '';
      }
    };

    const formattedOrder = formatFailedChecks('Pedido', orderChecks);
    const formattedClient = formatFailedChecks('Cliente', clientChecks);
    const formattedRelatedPerson = formatFailedChecks('Persona relacionada', relatedPersonChecks);
    const formattedShipment = formatFailedChecks('Envio', shipmentChecks);

    const checksText = [formattedOrder, formattedClient, formattedRelatedPerson, formattedShipment]
      .filter(Boolean)
      .join('\n\n');
    const result = `Completar Totalum:\n\n${checksText}`;

    return result;
  } catch (error) {
    throw new Error(`Error creating task by order failed checks. ${error.message}`);
  }
}

async function checkTOrderCompletion(orderId: string) {
  try {
    const extendedOrder = await getExtendedOrderById(orderId);
    const relatedPersonClient = await getClientById(extendedOrder.persona_relacionada?.[0]?.cliente?._id);
    const client = extendedOrder.cliente;
    const shipment = extendedOrder?.envio?.[0];

    const orderChecks = generateChecks(extendedOrder, ORDER_FIELD_CONDITIONS);
    const clientChecks = generateChecks(client, CLIENT_FIELD_CONDITIONS);
    const shipmentChecks = generateChecks(shipment, SHIPMENT_FIELD_CONDITIONS);
    const relatedPersonChecks = generateChecks(relatedPersonClient, CLIENT_FIELD_CONDITIONS);

    return { extendedOrder, orderChecks, clientChecks, shipmentChecks, relatedPersonChecks };
  } catch (error) {
    throw new Error(`Error while getting checks for Totalum order completion. ${error.message}`);
  }
}

export async function updateTotalumOrderFromDocumentsDetails(
  databaseOrder: DatabaseOrder,
  orderDetails: OrderDetailsBodyWithId
) {
  const { orderId } = orderDetails;

  const orderUpdate = parseOrderDetailsFromDatabaseToTotalum(orderDetails);
  const client = parseClientFromDatabaseToTotalum(orderDetails, databaseOrder);
  const relatedPersonClient = parseRelatedPersonClientFromDatabaseToTotalum(orderDetails);
  const shipment = parseShipmentFromDatabaseToTotalum(orderDetails, databaseOrder);

  const totalumOrder = await getTotalumOrderFromDatabaseOrderId(orderId);

  const newClientId = await createTotalumClientByDocumentsDetails(client);
  await createTotalumRelatedPersonByDocumentsDetails(relatedPersonClient, totalumOrder);
  await createTotalumShipmentAndLinkToOrder(shipment, totalumOrder._id);

  await updateTotalumOrderByDocumentsDetails(totalumOrder, orderUpdate, newClientId);
}

async function createTotalumClientByDocumentsDetails(client: Partial<TClient>): Promise<string> {
  const clientResponse = await totalumSdk.crud.createItem('cliente', client);
  const newClientId = clientResponse.data.data.insertedId;

  return newClientId;
}

async function createTotalumRelatedPersonByDocumentsDetails(
  relatedPersonClient: Partial<TClient>,
  totalumOrder: TotalumOrder
): Promise<string> {
  const relatedPersonClientResponse = await totalumSdk.crud.createItem('cliente', relatedPersonClient);
  const newRelatedPersonClientId = relatedPersonClientResponse.data.data.insertedId;

  const relatedPersonResponse = await totalumSdk.crud.createItem('persona_relacionada', {
    cliente: newRelatedPersonClientId,
    pedido: totalumOrder._id,
  });
  const newRelatedPersonId = relatedPersonResponse.data.data.insertedId;

  return newRelatedPersonId;
}

async function updateTotalumOrderByDocumentsDetails(
  totalumOrder: TotalumOrder,
  orderUpdate: Partial<TotalumOrder>,
  clientId: string
) {
  const notas = totalumOrder.notas.replace('Esperando documentación del cliente. ', '');
  const update: TotalumOrder = {
    ...totalumOrder,
    ...orderUpdate,
    notas,
    cliente: clientId,
  };

  await totalumSdk.crud.editItemById('pedido', totalumOrder._id, update);
}

export async function uploadWhatsappOrderFilesToDrive(
  whatsappOrder: WhatsappOrder,
  files: Express.Multer.File[]
): Promise<string> {
  if (!files || files.length === 0) {
    return null;
  }

  const orderFolderId = await getOrderFolder(whatsappOrder.vehiclePlate, EXPEDIENTES_DRIVE_FOLDER_ID);
  const folderUrl = `https://drive.google.com/drive/folders/${orderFolderId}`;

  for (const file of files) {
    await uploadStreamFileToDrive(file, orderFolderId);
  }

  const textFileString = `Teléfono comprador: ${whatsappOrder.buyer.phoneNumber}

  Teléfono vendedor: ${whatsappOrder.seller.phoneNumber}
  `;

  const textFile = await createTextFile(textFileString);
  await uploadStreamFileToDrive(textFile as Express.Multer.File, orderFolderId);

  return folderUrl;
}

export async function createExtendedOrderByWhatsappOrder(whatsappOrder: WhatsappOrder, folderUrl: string): Promise<string> {
  try {
    const order = parseOrderFromWhatsappToTotalum(whatsappOrder);
    const client = parseClientFromWhatsappToTotalum(whatsappOrder);
    const relatedPersonClient = parseRelatedPersonFromWhatsappToTotalum(whatsappOrder);
    const shipment = parseShipmentFromWhatsappToTotalum(whatsappOrder);

    const clientResponse = await totalumSdk.crud.createItem('cliente', client);
    const newClientId = clientResponse.data.data.insertedId;

    const orderResponse = await totalumSdk.crud.createItem('pedido', {
      ...order,
      cliente: newClientId,
      fecha_inicio: getCurrentOrNextMonday(),
      documentos: folderUrl,
    });
    const newOrderId = orderResponse.data.data.insertedId;

    await createTotalumShipmentAndLinkToOrder(shipment, newOrderId);

    const relatedPersonClientResponse = await totalumSdk.crud.createItem('cliente', relatedPersonClient);
    const newRelatedPersonClientId = relatedPersonClientResponse.data.data.insertedId;

    await totalumSdk.crud.createItem('persona_relacionada', {
      cliente: newRelatedPersonClientId,
      pedido: newOrderId,
    });

    return newOrderId;
  } catch (error) {
    if (error?.response?.data?.errors)
      throw new Error(`Error creating extended order by whatsapp order. ${error.response.data.errors}`);
    throw new Error(`Error creating extended order by whatsapp order. ${error}`);
  }
}
