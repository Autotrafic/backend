import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import { TOrderState } from '../../interfaces/enums';
import { getCurrentTrimesterDates } from '../../utils/funcs';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export async function getClientById(clientId: string) {
  try {
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

export async function getProfessionalPartnerById(partnerId: string) {
  try {
    const clientResponse = await totalumSdk.crud.getItemById('socio_profesional', partnerId);
    return clientResponse.data.data;
  } catch (error) {
    throw new Error(`Error fetching Totalum professional partner by id. ${error}`);
  }
}

export async function getShipmentNestedData() {
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

export async function getOrdersPendingToShip() {
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
