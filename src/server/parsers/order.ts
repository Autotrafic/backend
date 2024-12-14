import { TotalumParsedOrder } from '../../database/models/Order/Order';
import { DatabaseOrder, WebOrder, WebOrderDetails } from '../../database/models/Order/WebOrder';
import {
  autonomousCommunityMap,
  AutonomousCommunityValue,
  reverseAutonomousCommunityMap,
  TOrderState,
  TOrderType,
} from '../../interfaces/enums';
import { OrderDetailsBody, WhatsappOrder } from '../../interfaces/import/order';
import { TotalumShipment } from '../../interfaces/totalum/envio';
import { TAutonomousCommunity, TotalumOrder } from '../../interfaces/totalum/pedido';

function parseAutonomousCommunityToTotalum(value: AutonomousCommunityValue): TAutonomousCommunity {
  return autonomousCommunityMap[value];
}

function parseAutonomousCommunityToEnum(value: TAutonomousCommunity): AutonomousCommunityValue {
  return reverseAutonomousCommunityMap[value];
}

export function parseOrderFromWebToTotalum(webOrder: WebOrder): Partial<TotalumOrder> {
  return {
    autotrafic_id: webOrder.orderId,
    prioridad: null,
    estado: 'Nuevo pedido web',
    tipo: 'Transferencia',
    fecha_inicio: new Date(),
    matricula: null,
    documentos: null,
    fecha_de_contacto: null,
    total_facturado: Number(webOrder.prices.totalPrice),
    mandatos: 'No enviados',
    comunidad_autonoma: parseAutonomousCommunityToTotalum(webOrder.user.buyerCommunity),
    notas: `Esperando documentación del cliente. ${
      webOrder.crossSelling.etiquetaMedioambiental ? '❗️Pedido con Etiqueta Medioambiental❗️' : ''
    } ${webOrder.crossSelling.informeDgt ? '❗️Pedido con Informe DGT❗️' : ''} ${webOrder.user.phoneNumber}`,
  };
}

export function parseOrderFromWhatsappToTotalum(whatsappOrder: WhatsappOrder): Partial<TotalumOrder> {
  const { orderType, totalInvoiced, autonomousCommunity, vehiclePlate, firstTouchDate } = whatsappOrder;

  let orderState;
  if (
    (orderType === TOrderType.Transferencia && totalInvoiced !== 129.95 && totalInvoiced !== 94.95) ||
    orderType === TOrderType.EntregaCompraventa
  ) {
    orderState = TOrderState.PendientePagoITP;
  } else {
    orderState = TOrderState.PendienteTramitarA9;
  }

  return {
    tipo: orderType,
    estado: orderState,
    comunidad_autonoma: autonomousCommunity,
    matricula: vehiclePlate,
    fecha_de_contacto: firstTouchDate,
    total_facturado: totalInvoiced,
    mandatos: 'No enviados',
  };
}

export function parseOrderDetailsFromDatabaseToTotalum(orderDetails: OrderDetailsBody): Partial<TotalumOrder> {
  const { vehiclePlate } = orderDetails;

  return {
    matricula: vehiclePlate,
  };
}

export function parseClientFromDatabaseToTotalum(
  orderDetails: OrderDetailsBody,
  databaseOrder: DatabaseOrder
): Partial<TClient> {
  return { telefono: orderDetails.buyerPhone, email: databaseOrder.user.email };
}

export function parseRelatedPersonClientFromDatabaseToTotalum(orderDetails: OrderDetailsBody): Partial<TClient> {
  return { telefono: orderDetails.sellerPhone };
}

export function parseShipmentFromDatabaseToTotalum(
  orderDetails: OrderDetailsBody,
  databaseOrder: DatabaseOrder
): Partial<TotalumShipment> {
  const { address, postalCode, city } = orderDetails.shipmentAddress;

  return {
    referencia: orderDetails.vehiclePlate,
    direccion: address,
    codigo_postal: postalCode,
    localidad: city,
    telefono: orderDetails.buyerPhone,
    email: databaseOrder.user.email,
  };
}

export function parseOrderFromTotalumToWeb(order: TotalumOrder): TotalumParsedOrder {
  if (!order) return null;

  return {
    autonomousCommunity: parseAutonomousCommunityToEnum(order.comunidad_autonoma),
    priority: order.prioridad,
    state: order.estado,
    type: order.tipo,
    startDate: order.fecha_inicio,
    invoice: order.factura,
    vehiclePlate: order.matricula,
    documentsLink: order.documentos,
    notes: order.notas,
    itpPaid: order.itp_pagado,
    totalInvoiced: order.total_facturado,
    autotraficId: order.autotrafic_id,
    clientId: order.cliente,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    metadata: order.metadata,
    // eslint-disable-next-line no-underscore-dangle
    _id: order._id,
  };
}

export function parseWebOrderToTotalum(webOrder: WebOrder): Partial<TotalumOrder> {
  return {};
}

export function parseRegisterWhatsappOrderBody(whatsappOrder: WhatsappOrder) {
  if (typeof whatsappOrder.firstTouchDate === 'string') {
    whatsappOrder.firstTouchDate = new Date(whatsappOrder.firstTouchDate);
  }
  if (typeof whatsappOrder.shipmentAddress === 'string') {
    whatsappOrder.shipmentAddress = JSON.parse(whatsappOrder.shipmentAddress);
  }
  if (typeof whatsappOrder.professionalPartner === 'string') {
    whatsappOrder.professionalPartner = JSON.parse(whatsappOrder.professionalPartner);
  }
  if (typeof whatsappOrder.collaborator === 'string') {
    whatsappOrder.collaborator = JSON.parse(whatsappOrder.collaborator);
  }
  if (typeof whatsappOrder.buyer === 'string') {
    whatsappOrder.buyer = JSON.parse(whatsappOrder.buyer);
  }
  if (typeof whatsappOrder.seller === 'string') {
    whatsappOrder.seller = JSON.parse(whatsappOrder.seller);
  }
}
