import { TotalumApiSdk } from 'totalum-api-sdk';
import { DatabaseOrder } from '../../database/models/Order/WebOrder';
import { totalumOptions } from '../../utils/constants';
import { OrderDetailsBodyWithId } from '../../interfaces/import/order';
import { ExtendedTotalumOrder, TotalumOrder } from '../../interfaces/totalum/pedido';
import {
  parseClientFromDatabaseToTotalum,
  parseOrderDetailsFromDatabaseToTotalum,
  parseRelatedPersonClientFromDatabaseToTotalum,
  parseShipmentFromDatabaseToTotalum,
} from '../parsers/order';
import { createTask, getClientById, getExtendedOrderById, getTotalumOrderFromDatabaseOrderId } from '../services/totalum';
import { TotalumShipment } from '../../interfaces/totalum/envio';
import {
  CLIENT_FIELD_CONDITIONS,
  generateChecks,
  ORDER_FIELD_CONDITIONS,
  SHIPMENT_FIELD_CONDITIONS,
} from '../../utils/checks';
import { Check } from '../../interfaces/checks';
import { TTaskState } from '../../interfaces/enums';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export async function checkTOrderCompletion(orderId: string) {
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

export async function createTaskByOrderFailedChecks(orderId: string) {
  try {
    const { extendedOrder, orderChecks, clientChecks, shipmentChecks, relatedPersonChecks } = await checkTOrderCompletion(
      orderId
    );

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
      .join('\n');
    const taskDescription = `Completar Totalum:\n${checksText}`;

    const taskOptions = {
      state: TTaskState.Pending,
      description: taskDescription,
      url: extendedOrder.documentos,
      title: extendedOrder.matricula,
    };
    await createTask(taskOptions);
  } catch (error) {
    throw new Error(`Error creating task by order failed checks. ${error.message}`);
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
