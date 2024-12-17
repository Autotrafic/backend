import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import { TOrderState, TOrderType, TTaskState } from '../../interfaces/enums';
import { cleanObject, getCurrentTrimesterDates } from '../../utils/funcs';
import { TExtendedOrder, TotalumOrder } from '../../interfaces/totalum/pedido';
import { ExtendedTotalumShipment, TotalumShipment } from '../../interfaces/totalum/envio';
import { TTask } from '../../interfaces/totalum/tarea';
import { Accounting } from '../../interfaces/totalum/contabilidad';
import { parseAccountingFromTotalum } from '../parsers/logger';

const totalumSdk = new TotalumApiSdk(totalumOptions);

// ------ order ------
export async function getOrderFromDatabaseOrderId(databaseOrderId: string): Promise<TotalumOrder> {
  const filter = { autotrafic_id: databaseOrderId };
  const response = await totalumSdk.crud.getItems('pedido', {
    filter: [filter],
  });
  const totalumOrder: TotalumOrder = response.data.data[0];

  return totalumOrder;
}

export async function getOrderById(orderId: string) {
  try {
    const clientResponse = await totalumSdk.crud.getItemById('pedido', orderId);
    return clientResponse.data.data;
  } catch (error) {
    throw new Error(`Error fetching Totalum order by id. ${error}`);
  }
}

export async function getExtendedOrderById(orderId: string): Promise<TExtendedOrder> {
  const nestedQuery = {
    pedido: {
      tableFilter: {
        filter: [
          {
            _id: orderId,
          },
        ],
      },
      cliente: { representante: { cliente: {} } },
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

export async function getOrdersByVehiclePlateAndOrderType(
  vehiclePlate: string,
  orderType: TOrderType
): Promise<TExtendedOrder[]> {
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

export async function getOrdersPendingToShip(): Promise<TExtendedOrder[]> {
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

export async function updateOrderById(orderId: string, update: Partial<TExtendedOrder>) {
  try {
    await totalumSdk.crud.editItemById('pedido', orderId, update);
  } catch (error) {
    throw new Error(`Error updating Totalum order. ${error}`);
  }
}

// ------ client ------
export async function getClientById(clientId: string): Promise<TClient> {
  try {
    if (!clientId) return;
    const clientResponse = await totalumSdk.crud.getItemById('cliente', clientId);
    return clientResponse.data.data;
  } catch (error) {
    throw new Error(`Error fetching Totalum client by id. ${error}`);
  }
}

export async function getExtendedClientById(clientId: string): Promise<TExtendedClient> {
  const nestedQuery = {
    cliente: {
      tableFilter: {
        filter: [
          {
            _id: clientId,
          },
        ],
      },
      socios_profesionales: {},
    },
  };

  try {
    const clientResponse = await totalumSdk.crud.getNestedData(nestedQuery);
    return clientResponse.data.data[0];
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error fetching Totalum client by id. ${error.response.data.errors}`);
    } else {
      throw new Error(`Error fetching Totalum client by id. Unknown error`);
    }
  }
}

export async function getClientByNif(clientNif: string): Promise<TClient> {
  try {
    const options = { filter: [{ nif: clientNif }] };

    const response = await totalumSdk.crud.getItems('cliente', options);

    return response.data?.data?.[0];
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error fetching Totalum client by nif. ${error.response.data.errors}`);
    } else {
      throw new Error(`Error fetching Totalum client by nif. Unknown error`);
    }
  }
}

export async function createClient(client: Partial<TClient>): Promise<string> {
  try {
    const clientResponse = await totalumSdk.crud.createItem('cliente', client);
    const newClientId = clientResponse.data.data.insertedId;

    return newClientId;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error creando cliente. ${error.response.data.errors}`);
    } else {
      throw new Error(`Error creando cliente. Error desconocido`);
    }
  }
}

export async function updateClientById(clientId: string, update: Partial<TClient>) {
  try {
    const cleanedClient = cleanObject(update);

    await totalumSdk.crud.editItemById('cliente', clientId, cleanedClient);

    return clientId;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error updating Totalum client by id. ${error.response.data.errors}`);
    } else {
      throw new Error(`Error updating Totalum client by id. Unknown error`);
    }
  }
}

// ------ related person ------
export async function getExtendedRelatedPersonById(relatedPersonId: string) {
  const nestedQuery = {
    persona_relacionada: {
      tableFilter: {
        filter: [
          {
            _id: relatedPersonId,
          },
        ],
      },
      cliente: { socios_profesionales: {} },
    },
  };

  try {
    const relatedPersonResponse = await totalumSdk.crud.getNestedData(nestedQuery);
    return relatedPersonResponse.data.data[0];
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error fetching Totalum related person by id. ${error.response.data.errors}`);
    } else {
      throw new Error(`Error fetching Totalum related person by id. Unknown error`);
    }
  }
}

// ------ representative ------
export async function getRepresentativeByNif(representativeNif: string): Promise<TRepresentative> {
  try {
    const options = { filter: [{ nif: representativeNif }] };

    const response = await totalumSdk.crud.getItems('representante', options);

    return response.data?.data?.[0];
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error fetching Totalum client by nif. ${error.response.data.errors}`);
    } else {
      throw new Error(`Error fetching Totalum client by nif. Unknown error`);
    }
  }
}

export async function createRepresentative(representative: Partial<TRepresentative>): Promise<string> {
  try {
    const representativeResponse = await totalumSdk.crud.createItem('representante', representative);
    const newRepresentativeId = representativeResponse.data.data.insertedId;

    return newRepresentativeId;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error creando representante. ${error.response.data.errors}`);
    } else {
      throw new Error(`Error creando representante. Error desconocido`);
    }
  }
}

export async function updateRepresentativeById(representativeId: string, update: Partial<TRepresentative>) {
  try {
    const cleanedRepresentative = cleanObject(update);

    await totalumSdk.crud.editItemById('representante', representativeId, cleanedRepresentative);

    return representativeId;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error actualizando los datos del representante. ${error.response.data.errors}`);
    } else {
      throw new Error(`Error actualizando los datos del representante. Error desconocido`);
    }
  }
}

// ------ professional partner ------
export async function getAllProfessionalParteners(): Promise<TProfessionalPartner[]> {
  try {
    const professionalPartners = await totalumSdk.crud.getItems('socios_profesionales');
    return professionalPartners.data.data;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error fetching Totalum professional partners. ${error.response.data.errors}`);
    } else {
      throw new Error(`Error fetching Totalum professional partners. Unknown error`);
    }
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

// ------ shipment ------
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
      pedido: { cliente: {}, socios_profesionales: { cliente: {} } },
    },
  };

  try {
    const clientResponse = await totalumSdk.crud.getNestedData(nestedQuery);
    return clientResponse.data.data[0];
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error fetching Totalum shipment by id. ${error.response.data.errors}`);
    } else {
      throw new Error(`Error fetching Totalum shipment by id. Unknown error`);
    }
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

export async function getShipmentsByOrders(): Promise<TExtendedOrder[]> {
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

export async function createTotalumShipmentAndLinkToOrder(
  shipment: Partial<TotalumShipment>,
  orderId: string
): Promise<string> {
  const shipmentResponse = await totalumSdk.crud.createItem('envio', shipment);
  const newShipmentId = shipmentResponse.data.data.insertedId;

  await totalumSdk.crud.addManyToManyReferenceItem('envio', newShipmentId, 'pedido', orderId);

  return newShipmentId;
}

export async function updateShipmentById(shipmentId: string, update: Partial<ExtendedTotalumShipment>) {
  try {
    await totalumSdk.crud.editItemById('envio', shipmentId, update);
  } catch (error) {
    throw new Error(`Error updating Totalum shipment. ${error}`);
  }
}

export async function updateShipmentByOrderId(orderId: string, update: Partial<ExtendedTotalumShipment>) {
  try {
    const extendedOrder = await getExtendedOrderById(orderId);

    if (extendedOrder.envio.length > 1) throw new Error('El pedido no contiene envio o contiene muchos envíos');

    if (extendedOrder.envio.length < 1) {
      await createTotalumShipmentAndLinkToOrder(update, orderId);
      return;
    }

    await totalumSdk.crud.editItemById('envio', extendedOrder.envio[0]._id, update);
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error updating shipment by order id. ${error.response.data.errors}`);
    } else {
      throw new Error(`Error updating shipment by order id. Unknown error`);
    }
  }
}

// ------ task ------
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

export async function createTask({
  state,
  url,
  title,
  description,
}: {
  state: TTaskState;
  url: string;
  title: string;
  description: string;
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

export async function updateTaskById(id: string, update: Partial<TTask>) {
  const response = await totalumSdk.crud.editItemById('tarea', id, update);

  return response.data.data;
}

// ------ collaborator ------
export async function getAllCollaborators(): Promise<TProfessionalPartner[]> {
  try {
    const professionalPartners = await totalumSdk.crud.getItems('gestorias_colaboradoras');
    return professionalPartners.data.data;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error fetching Totalum collaborators. ${error.response.data.errors}`);
    } else {
      throw new Error(`Error fetching Totalum collaborators. Unknown error`);
    }
  }
}

// ------ accounting ------
export async function createAccounting(accountingInfo: Accounting) {
  const parsedAccounting = parseAccountingFromTotalum(accountingInfo);

  const response = await totalumSdk.crud.createItem('contabilidad', parsedAccounting as any);

  return response.data.data;
}

// ------ file ------
export async function generatePdfByTotalumTemplate(fileOptions: MandateFileOptions) {
  const { templateId, fileName, data } = fileOptions;

  try {
    const file = await totalumSdk.files.generatePdfByTemplate(templateId, data, fileName);

    return file.data.data;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error generating Totalum pdf by template. ${error.response.data.errors}`);
    } else {
      throw new Error(`Error generating Totalum pdf by template. Unknown error`);
    }
  }
}

// ------ composed ------
export async function createClientAndRelatedItem(clientData: Partial<TClient>, relatedItemData: any) {
  try {
    if (clientData) {
      const newClient = await totalumSdk.crud.createItem('cliente', clientData);
      const newClientId = newClient.data.data.insertedId;

      const newRelatedItem = await totalumSdk.crud.createItem(relatedItemData.collection, {
        ...relatedItemData.data,
        cliente: newClientId,
      });

      const newRelatedItemId = newRelatedItem.data.data.insertedId;
      return newRelatedItemId;
    }
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error creando un cliente y un nuevo documento relacionado. ${error.response.data.errors}`);
    } else {
      throw new Error(`Error creando un cliente y un nuevo documento relacionado. Unknown error`);
    }
  }
}
