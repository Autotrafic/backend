import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import { TOrderState } from '../../interfaces/enums';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export async function getClientById(clientId: string) {
  try {
    const clientResponse = await totalumSdk.crud.getItemById('cliente', clientId);
    return clientResponse.data.data;
  } catch (error) {
    throw new Error(`Error fetching Totalum client by id. ${error}`);
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
    throw new Error(`Error fetching shipment nested data from Totalum. ${error}`);
  }
}
