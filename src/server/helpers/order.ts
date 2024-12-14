import { WhatsappOrder } from '../../interfaces/import/order';
import { TotalumShipment } from '../../interfaces/totalum/envio';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import { parseClientFromWhatsappToTotalum, parseRelatedPersonFromWhatsappToTotalum } from '../parsers/client';
import { parseOrderFromWhatsappToTotalum } from '../parsers/order';
import { parseShipmentFromWhatsappToTotalum } from '../parsers/shipment';
import { createClient, getClientByNif, updateClientById } from '../services/totalum';

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

interface ParsedWhatsappOrder {
  order: Partial<TotalumOrder>;
  client: Partial<TClient>;
  relatedPersonClient: Partial<TClient>;
  shipment: Partial<TotalumShipment>;
}
