import { title } from 'process';
import { TTaskState } from '../../interfaces/enums';
import { WhatsappOrder } from '../../interfaces/import/order';
import { TotalumShipment } from '../../interfaces/totalum/envio';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import { parseClientFromWhatsappToTotalum, parseRelatedPersonFromWhatsappToTotalum } from '../parsers/client';
import { parseOrderFromWhatsappToTotalum } from '../parsers/order';
import { parseShipmentFromWhatsappToTotalum } from '../parsers/shipment';
import { createClient, createTask, getClientByNif, updateClientById } from '../services/totalum';
import { url } from 'inspector';
import { formatCurrentDateToSpain } from '../parsers/other';
import { WebOrder, WebOrderDetails } from '../../database/models/Order/WebOrder';

export function parseFromWhatsappToTotalum(whatsappOrder: WhatsappOrder): ParsedWhatsappOrder {
  const order = parseOrderFromWhatsappToTotalum(whatsappOrder);
  const client = parseClientFromWhatsappToTotalum(whatsappOrder);
  const relatedPersonClient = parseRelatedPersonFromWhatsappToTotalum(whatsappOrder);
  const shipment = parseShipmentFromWhatsappToTotalum(whatsappOrder);

  return { order, client, relatedPersonClient, shipment };
}

export async function checkExistingTotalumClient(client: Partial<TClient>): Promise<string> {
  const existingClient = await getClientByNif(client.nif);

  return existingClient ? await updateClientById(existingClient._id, client) : await createClient(client);
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
      title: `${totalumOrder.matricula} - ${currentTime}`,
      description: `Enviar provisional => ${order.buyer.phoneNumber}`,
    };

    await createTask(secondTaskOptions);
  }
}

export async function createTaskByWhatsappOrder(whatsappOrder: WhatsappOrder, folderUrl: string) {
  const { buyer, vehiclePlate } = whatsappOrder;

  const currentTime = formatCurrentDateToSpain();
  const options = {
    state: TTaskState.Pending,
    url: folderUrl,
    title: `${vehiclePlate} - ${currentTime}`,
    description: `Enviar provisional => ${buyer.phoneNumber}`,
  };

  await createTask(options);
}

interface ParsedWhatsappOrder {
  order: Partial<TotalumOrder>;
  client: Partial<TClient>;
  relatedPersonClient: Partial<TClient>;
  shipment: Partial<TotalumShipment>;
}
