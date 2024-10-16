import { TotalumParsedOrder } from '../../database/models/Order/Order';
import { WebOrder, WebOrderDetails } from '../../database/models/Order/WebOrder';
import { autonomousCommunityMap, AutonomousCommunityValue, reverseAutonomousCommunityMap } from '../../interfaces/enums';
import { OrderDetailsBody, WhatsappOrder } from '../../interfaces/import/order';
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
    direccion_envio: null,
    codigo_envio: null,
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
  return {
    matricula: whatsappOrder.vehiclePlate,
    direccion_envio: whatsappOrder.shipmentAddress,
    fecha_de_contacto: whatsappOrder.firstTouchDate,
    total_facturado: whatsappOrder.totalInvoiced,
  };
}

export function parseOrderDetailsFromWebToTotalum(orderDetails: OrderDetailsBody): Partial<TotalumOrder> {
  const { vehiclePlate, shipmentAddress } = orderDetails;

  return {
    matricula: vehiclePlate,
    direccion_envio: `${shipmentAddress.address}, ${shipmentAddress.postalCode} ${shipmentAddress.city}`,
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
    shipmentAddress: order.direccion_envio,
    shipmentCode: order.codigo_envio,
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

export function getDriveFolderIdFromLink(driveLink: string): string {
  return driveLink.split('/').pop();
}
