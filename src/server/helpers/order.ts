import { TTaskState } from '../../interfaces/enums';
import { WhatsappOrder } from '../../interfaces/import/order';
import { TotalumShipment } from '../../interfaces/totalum/envio';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import {
  parseClientFromWhatsappToTotalum,
  parseClientRepresentativeFromWhatsappToTotalum,
  parseRelatedPersonFromWhatsappToTotalum,
  parseRelatedPersonRepresentativeFromWhatsappToTotalum,
} from '../parsers/client';
import { parseOrderFromWhatsappToTotalum } from '../parsers/order';
import { parseShipmentFromWhatsappToTotalum } from '../parsers/shipment';
import {
  createClient,
  createRepresentative,
  createTask,
  getClientByNif,
  getRepresentativeByNif,
  updateClientById,
  updateRepresentativeById,
} from '../services/totalum';
import { formatCurrentDateToSpain, parsePhoneNumberForWhatsApp } from '../parsers/other';
import { WebOrder, WebOrderDetails } from '../../database/models/Order/WebOrder';
import { sendWhatsappMessage } from '../services/notifier';
import { TClient } from '../../interfaces/totalum/cliente';

export function parseFromWhatsappToTotalum(whatsappOrder: WhatsappOrder): ParsedWhatsappOrder {
  const order = parseOrderFromWhatsappToTotalum(whatsappOrder);
  const client = parseClientFromWhatsappToTotalum(whatsappOrder);
  const relatedPersonClient = parseRelatedPersonFromWhatsappToTotalum(whatsappOrder);
  const clientRepresentative = parseClientRepresentativeFromWhatsappToTotalum(whatsappOrder);
  const relatedPersonRepresentative = parseRelatedPersonRepresentativeFromWhatsappToTotalum(whatsappOrder);
  const shipment = parseShipmentFromWhatsappToTotalum(whatsappOrder);

  return { order, client, relatedPersonClient, clientRepresentative, relatedPersonRepresentative, shipment };
}

export async function checkExistingTotalumClient(client: Partial<TClient>): Promise<string> {
  const existingClient = await getClientByNif(client.nif);

  return existingClient ? await updateClientById(existingClient._id, client) : await createClient(client);
}

export async function checkExistingTotalumRepresentative(representative: Partial<TRepresentative>): Promise<string> {
  const existingRepresentative = await getRepresentativeByNif(representative.nif);

  return existingRepresentative
    ? await updateRepresentativeById(existingRepresentative._id, representative)
    : await createRepresentative(representative);
}

export async function createTasksByWebOrder(
  order: WebOrder & WebOrderDetails,
  totalumOrder: TotalumOrder,
  folderUrl: string
) {
  const firstTaskOptions = {
    state: TTaskState.Pending,
    url: folderUrl,
    title: `${totalumOrder.matricula}`,
    description: 'Completar Totalum',
  };

  await createTask(firstTaskOptions);

  if (order && order.buyer) {
    const currentTime = formatCurrentDateToSpain();
    const secondTaskOptions = {
      state: TTaskState.Pending,
      url: folderUrl,
      title: `✅ Nuevo pedido  /  ${totalumOrder.matricula}  /  ${currentTime}`,
      description: `Enviar mandatos`,
    };

    await createTask(secondTaskOptions);
  }
}

export async function createTaskByWhatsappOrder(whatsappOrder: WhatsappOrder, folderUrl: string) {
  const { vehiclePlate } = whatsappOrder;

  const currentTime = formatCurrentDateToSpain();
  const options = {
    state: TTaskState.Pending,
    url: folderUrl,
    title: `✅ Nuevo pedido  /  ${vehiclePlate}  /  ${currentTime}`,
    description: `Enviar mandatos`,
  };

  await createTask(options);
}

export async function notifyNewOrderToCollaborator(whatsappOrder: WhatsappOrder, folderUrl: string) {
  try {
    const { collaborator, autonomousCommunity, vehiclePlate, orderType } = whatsappOrder;

    const message = `Buenas! *Nueva ${orderType}: ${autonomousCommunity} / ${vehiclePlate}*
En cuanto tengamos los mandatos firmados los adjuntamos en la carpeta de Drive

${folderUrl}`;
    const phoneNumber = parsePhoneNumberForWhatsApp(collaborator.phoneNumber);

    await sendWhatsappMessage({ phoneNumber, message });
  } catch (error) {
    throw new Error(`Error notifying new order to collaborator. ${error.message}`);
  }
}

interface ParsedWhatsappOrder {
  order: Partial<TotalumOrder>;
  client: Partial<TClient>;
  relatedPersonClient: Partial<TClient>;
  shipment: Partial<TotalumShipment>;
  clientRepresentative: Partial<TRepresentative>;
  relatedPersonRepresentative: Partial<TRepresentative>;
}
