import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import { TOrderState, TOrderType, TTaskState } from '../../interfaces/enums';
import { getCurrentOrNextMonday, getCurrentTrimesterDates } from '../../utils/funcs';
import { ExtendedTotalumOrder, TotalumOrder } from '../../interfaces/totalum/pedido';
import { ExtendedTotalumShipment } from '../../interfaces/totalum/envio';
import { TTask } from '../../interfaces/totalum/tarea';
import { Accounting } from '../../interfaces/totalum/contabilidad';
import { parseAccountingFromTotalum } from '../parsers/logger';
import { WhatsappOrder } from '../../interfaces/import/order';
import { parseOrderFromWhatsappToTotalum } from '../parsers/order';
import { parseClientFromWhatsappToTotalum, parseRelatedPersonFromWhatsappToTotalum } from '../parsers/client';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export async function getTotalumOrderFromDatabaseOrderId(databaseOrderId: string): Promise<TotalumOrder> {
  const filter = { autotrafic_id: databaseOrderId };
  const response = await totalumSdk.crud.getItems('pedido', {
    filter: [filter],
  });
  const totalumOrder: TotalumOrder = response.data.data[0];

  return totalumOrder;
}

export async function getClientById(clientId: string): Promise<TClient> {
  try {
    if (!clientId) return;
    const clientResponse = await totalumSdk.crud.getItemById('cliente', clientId);
    return clientResponse.data.data;
  } catch (error) {
    throw new Error(`Error fetching Totalum client by id. ${error}`);
  }
}

export async function getOrderById(orderId: string) {
  try {
    const clientResponse = await totalumSdk.crud.getItemById('pedido', orderId);
    return clientResponse.data.data;
  } catch (error) {
    throw new Error(`Error fetching Totalum order by id. ${error}`);
  }
}

export async function getExtendedOrderById(orderId: string): Promise<ExtendedTotalumOrder> {
  const nestedQuery = {
    pedido: {
      tableFilter: {
        filter: [
          {
            _id: orderId,
          },
        ],
      },
      cliente: {},
      envio: {},
      persona_relacionada: { cliente: {} },
    },
  };

  try {
    const response = await totalumSdk.crud.getNestedData(nestedQuery);
    return response.data.data[0];
  } catch (error) {
    throw new Error(`Error fetching Totalum shipment by id. ${error}`);
  }
}

export async function getOrdersByVehiclePlateAndOrderType(
  vehiclePlate: string,
  orderType: TOrderType
): Promise<ExtendedTotalumOrder[]> {
  const nestedQuery = {
    pedido: {
      tableFilter: {
        filter: [
          {
            matricula: vehiclePlate,
          },
          {
            tipo: orderType,
          },
        ],
      },
      envio: {},
    },
  };

  try {
    const clientResponse = await totalumSdk.crud.getNestedData(nestedQuery);
    return clientResponse.data.data;
  } catch (error) {
    throw new Error(`Error fetching Totalum order by id. ${error}`);
  }
}

export async function getExtendedShipmentById(shipmentId: string): Promise<ExtendedTotalumShipment> {
  const nestedQuery = {
    envio: {
      tableFilter: {
        filter: [
          {
            _id: shipmentId,
          },
        ],
      },
      pedido: {},
    },
  };

  try {
    const clientResponse = await totalumSdk.crud.getNestedData(nestedQuery);
    return clientResponse.data.data[0];
  } catch (error) {
    throw new Error(`Error fetching Totalum shipment by id. ${error}`);
  }
}

export async function getProfessionalPartnerById(partnerId: string) {
  try {
    const clientResponse = await totalumSdk.crud.getItemById('socio_profesional', partnerId);
    return clientResponse.data.data;
  } catch (error) {
    throw new Error(`Error fetching Totalum professional partner by id. ${error}`);
  }
}

export async function getShipmentsNestedData() {
  const nestedTreeStructure = {
    envio: {
      pedido: {
        tarea: {},
        persona_relacionada: {},
      },
    },
  };

  try {
    const response = await totalumSdk.crud.getNestedData(nestedTreeStructure);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error fetching shipment nested data from Totalum. ${error}`);
  }
}

export async function getExtendedOrders() {
  const nestedTreeStructure = {
    pedido: {
      persona_relacionada: {},
      cliente: {},
      tableFilter: {
        pagination: {
          limit: 999,
          page: 0,
        },
      },
    },
  };

  try {
    const response = await totalumSdk.crud.getNestedData(nestedTreeStructure);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error fetching extended orders from Totalum. ${error}`);
  }
}

export async function getActualTrimesterExtendedOrders() {
  const trimesterDates = getCurrentTrimesterDates();
  const startTrimesterDate = trimesterDates.start;
  const endTrimesterDate = trimesterDates.end;

  const nestedTreeStructure = {
    pedido: {
      cliente: {},
      tableFilter: {
        filter: [
          {
            fecha_inicio: {
              gte: startTrimesterDate,
              lte: endTrimesterDate,
            },
          },
        ],
        pagination: {
          limit: 999,
          page: 0,
        },
      },
    },
  };

  try {
    const response = await totalumSdk.crud.getNestedData(nestedTreeStructure);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error fetching extended orders from Totalum. ${error}`);
  }
}

export async function getOrdersPendingToShip(): Promise<ExtendedTotalumOrder[]> {
  const nestedTreeStructure = {
    pedido: {
      envio: { pedido: {} },
      persona_relacionada: {},
      cliente: {},
      tableFilter: {
        filter: [
          {
            estado: TOrderState.PendienteEnvioCliente,
          },
        ],
      },
    },
  };

  try {
    const response = await totalumSdk.crud.getNestedData(nestedTreeStructure);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error fetching orders pending to ship from Totalum. ${error}`);
  }
}

export async function getShipmentsByOrders(): Promise<ExtendedTotalumOrder[]> {
  const nestedTreeStructure = {
    pedido: {
      envio: {},
      persona_relacionada: {},
      cliente: {},
      tableFilter: {
        filter: [
          {
            estado: TOrderState.PendienteEnvioCliente,
          },
        ],
      },
    },
  };

  try {
    const response = await totalumSdk.crud.getNestedData(nestedTreeStructure);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error fetching orders pending to ship from Totalum. ${error}`);
  }
}

export async function getShipmentByOrderId(orderId: string): Promise<ExtendedTotalumShipment> {
  const nestedQuery = {
    pedido: {
      tableFilter: {
        filter: [
          {
            _id: orderId,
          },
        ],
      },
      envio: { pedido: {} },
    },
  };

  try {
    const response = await totalumSdk.crud.getNestedData(nestedQuery);
    const shipments = response.data.data[0]?.envio;

    if (shipments && shipments.length < 1) throw new Error(`El pedido ${orderId} no contiene envío relacionado`);
    if (shipments && shipments.length > 1) throw new Error(`El pedido ${orderId} contiene múltiples envíos relacionados`);

    return shipments[0];
  } catch (error) {
    throw new Error(`Error fetching Totalum shipments by order id. ${error}`);
  }
}

export async function updateOrderById(orderId: string, update: Partial<ExtendedTotalumOrder>) {
  try {
    await totalumSdk.crud.editItemById('pedido', orderId, update);
  } catch (error) {
    throw new Error(`Error updating Totalum order. ${error}`);
  }
}

export async function updateShipmentById(shipmentId: string, update: Partial<ExtendedTotalumShipment>) {
  try {
    await totalumSdk.crud.editItemById('envio', shipmentId, update);
  } catch (error) {
    throw new Error(`Error updating Totalum shipment. ${error}`);
  }
}

export async function getAllPendingTasks(): Promise<TTask[]> {
  const response = await totalumSdk.crud.getItems('tarea', {
    filter: [
      {
        estado: { ne: TTaskState.Completed } as any,
      },
    ],
  });

  return response.data.data;
}

export async function updateTaskById(id: string, update: Partial<TTask>) {
  const response = await totalumSdk.crud.editItemById('tarea', id, update);

  return response.data.data;
}

export async function createAccounting(accountingInfo: Accounting) {
  const parsedAccounting = parseAccountingFromTotalum(accountingInfo);

  const response = await totalumSdk.crud.createItem('contabilidad', parsedAccounting as any);

  return response.data.data;
}

export async function createExtendedOrderByWhatsappOrder(whatsappOrder: WhatsappOrder, folderUrl: string): Promise<string> {
  try {
    const order = parseOrderFromWhatsappToTotalum(whatsappOrder);
    const client = parseClientFromWhatsappToTotalum(whatsappOrder);
    const relatedPersonClient = parseRelatedPersonFromWhatsappToTotalum(whatsappOrder);

    const clientResponse = await totalumSdk.crud.createItem('cliente', client);
    const newClientId = clientResponse.data.data.insertedId;

    const orderResponse = await totalumSdk.crud.createItem('pedido', {
      ...order,
      cliente: newClientId,
      estado: TOrderState.NuevoPedidoWhatsapp,
      fecha_inicio: getCurrentOrNextMonday(),
      tipo: whatsappOrder.orderType,
      documentos: folderUrl,
    });
    const newOrderId = orderResponse.data.data.insertedId;

    const relatedPersonClientResponse = await totalumSdk.crud.createItem('cliente', relatedPersonClient);
    const newRelatedPersonClientId = relatedPersonClientResponse.data.data.insertedId;

    await totalumSdk.crud.createItem('persona_relacionada', {
      cliente: newRelatedPersonClientId,
      pedido: newOrderId,
    });

    return newOrderId;
  } catch (error) {
    throw new Error(`Error creating extended order by whatsapp order. ${error}`);
  }
}

export async function createTask({
  state,
  description,
  url,
  title,
}: {
  state: TTaskState;
  description: string;
  url: string;
  title: string;
}): Promise<string> {
  try {
    const newTask = await totalumSdk.crud.createItem('tarea', {
      estado: state,
      descripcion: description,
      enlace: url,
      titulo: title,
    });

    return newTask.data.data.insertedId;
  } catch (error) {
    throw new Error(`Error creating task by whatsapp order. ${error}`);
  }
}

export async function getExtendedShipmentsByParcelId(parcelId: number): Promise<ExtendedTotalumShipment[]> {
  const nestedQuery = {
    envio: {
      tableFilter: {
        filter: [
          {
            sendcloud_parcel_id: parcelId,
          },
        ],
      },
      pedido: {},
    },
  };

  try {
    const shipmentResponse = await totalumSdk.crud.getNestedData(nestedQuery);
    return shipmentResponse.data.data;
  } catch (error) {
    throw new Error(`Error fetching Totalum shipment by sendcloud parcel id. ${error.message}`);
  }
}
