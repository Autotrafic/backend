import { TotalumApiSdk } from 'totalum-api-sdk';
import { DatabaseOrder } from '../../database/models/Order/WebOrder';
import { totalumOptions } from '../../utils/constants';
import { OrderDetailsBodyWithId } from '../../interfaces/import/order';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import {
  parseClientFromDatabaseToTotalum,
  parseOrderDetailsFromDatabaseToTotalum,
  parseRelatedPersonClientFromDatabaseToTotalum,
  parseShipmentFromDatabaseToTotalum,
} from '../parsers/order';
import { getTotalumOrderFromDatabaseOrderId } from '../services/totalum';
import { TotalumShipment } from '../../interfaces/totalum/envio';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export async function updateTotalumOrderFromDocumentsDetails(
  databaseOrder: DatabaseOrder,
  orderDetails: OrderDetailsBodyWithId
) {
  const { orderId } = orderDetails;

  const orderUpdate = parseOrderDetailsFromDatabaseToTotalum(orderDetails);
  const client = parseClientFromDatabaseToTotalum(orderDetails, databaseOrder);
  const relatedPersonClient = parseRelatedPersonClientFromDatabaseToTotalum(orderDetails);
  const shipment = parseShipmentFromDatabaseToTotalum(orderDetails);

  const totalumOrder = await getTotalumOrderFromDatabaseOrderId(orderId);

  const newClientId = await createTotalumClientByDocumentsDetails(client);
  await createTotalumRelatedPersonByDocumentsDetails(relatedPersonClient, totalumOrder);
  await createTotalumShipmentByDocumentsDetails(shipment, totalumOrder);

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

async function createTotalumShipmentByDocumentsDetails(
  shipment: Partial<TotalumShipment>,
  totalumOrder: TotalumOrder
): Promise<string> {
  const shipmentResponse = await totalumSdk.crud.createItem('envio', shipment);
  const newShipmentId = shipmentResponse.data.data.insertedId;

  await totalumSdk.crud.addManyToManyReferenceItem('envio', newShipmentId, 'pedido', totalumOrder._id);

  return newShipmentId;
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
