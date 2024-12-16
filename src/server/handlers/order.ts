import { TotalumApiSdk } from 'totalum-api-sdk';
import { DatabaseOrder } from '../../database/models/Order/WebOrder';
import { EXPEDIENTES_DRIVE_FOLDER_ID, totalumOptions } from '../../utils/constants';
import { OrderDetailsBodyWithId, WhatsappOrder } from '../../interfaces/import/order';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import {
  parseClientFromDatabaseToTotalum,
  parseOrderDetailsFromDatabaseToTotalum,
  parseRelatedPersonClientFromDatabaseToTotalum,
  parseShipmentFromDatabaseToTotalum,
} from '../parsers/order';
import {
  createTotalumShipmentAndLinkToOrder,
  getClientById,
  getExtendedOrderById,
  getOrderFromDatabaseOrderId,
  updateShipmentByOrderId,
} from '../services/totalum';
import {
  CLIENT_FIELD_CONDITIONS,
  generateChecks,
  ORDER_FIELD_CONDITIONS,
  SHIPMENT_FIELD_CONDITIONS,
} from '../../utils/checks';
import { Check } from '../../interfaces/checks';
import {
  getOrderFolder,
  shareFolderWithReaderPermission,
  uploadGoogleDocToDrive,
  uploadStreamFileToDrive,
} from '../services/googleDrive';
import { getCurrentOrNextMonday } from '../../utils/funcs';
import {
  checkExistingTotalumClient,
  checkExistingTotalumRepresentative,
  parseFromWhatsappToTotalum,
} from '../helpers/order';

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

  const totalumOrder = await getOrderFromDatabaseOrderId(orderId);

  const newClientId = await createTotalumClientByDocumentsDetails(client);
  await createTotalumRelatedPersonByDocumentsDetails(relatedPersonClient, totalumOrder);
  await updateShipmentByOrderId(totalumOrder._id, shipment);

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
  if ((!files || files.length === 0) && !whatsappOrder.buyer.phoneNumber && !whatsappOrder.seller.phoneNumber) {
    return null;
  }

  let folderId: string;
  let folderUrl: string;

  if (whatsappOrder.professionalPartner.driveId) {
    folderId = await getOrderFolder(whatsappOrder.vehiclePlate, whatsappOrder.professionalPartner.driveId);
  } else {
    folderId = await getOrderFolder(whatsappOrder.vehiclePlate, EXPEDIENTES_DRIVE_FOLDER_ID);
  }
  folderUrl = `https://drive.google.com/drive/folders/${folderId}`;

  for (const file of files) {
    await uploadStreamFileToDrive(file, folderId);
  }

  const textFileString = `Teléfono comprador: ${whatsappOrder.buyer.phoneNumber}

  Teléfono vendedor: ${whatsappOrder.seller.phoneNumber}
  `;
  await uploadGoogleDocToDrive(textFileString, 'Info adicional', folderId);

  if (whatsappOrder.collaborator.id) await shareFolderWithReaderPermission(folderId, whatsappOrder.collaborator.email);

  return folderUrl;
}

export async function createExtendedOrderByWhatsappOrder(whatsappOrder: WhatsappOrder, folderUrl: string): Promise<string> {
  try {
    const { order, client, relatedPersonClient, clientRepresentative, relatedPersonRepresentative, shipment } =
      parseFromWhatsappToTotalum(whatsappOrder);

    const clientId = client && (await checkExistingTotalumClient(client));

    const orderResponse = await totalumSdk.crud.createItem('pedido', {
      ...order,
      fecha_inicio: getCurrentOrNextMonday(),
      documentos: folderUrl,
      cliente: clientId,
      socio_profesional: whatsappOrder.professionalPartner.id ?? null,
      gestoria_colaboradora: whatsappOrder.collaborator.id ?? null,
    });

    const newOrderId = orderResponse.data.data.insertedId;

    await createTotalumShipmentAndLinkToOrder(shipment, newOrderId);

    let relatedPersonClientId;
    if (relatedPersonClient) {
      const newClient = await totalumSdk.crud.createItem('cliente', relatedPersonClient);
      relatedPersonClientId = newClient.data.data.insertedId;

      await totalumSdk.crud.createItem('persona_relacionada', {
        cliente: relatedPersonClientId,
        pedido: newOrderId,
      });
    }

    if (clientRepresentative) {
      await checkExistingTotalumRepresentative({ ...clientRepresentative, cliente: clientId });
    }
    if (relatedPersonRepresentative && relatedPersonClientId) {
      await checkExistingTotalumRepresentative({ ...relatedPersonRepresentative, cliente: relatedPersonClientId });
    }

    return newOrderId;
  } catch (error) {
    if (error?.response?.data?.errors)
      throw new Error(`Error creating extended order by whatsapp order. ${error.response.data.errors}`);
    throw new Error(`Error creating extended order by whatsapp order. ${error}`);
  }
}
