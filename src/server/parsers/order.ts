import { Order } from "../../database/models/Order/Order";
import { TotalumOrder } from "../../database/models/Order/TotalumSchema";
import { WebOrder } from "../../database/models/Order/WebOrder";

export default function parseOrderFromTotalum(order: TotalumOrder): Order {
  return {
    autonomousCommunity: order.comunidad_autonoma,
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
    clientId: order.cliente,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    metadata: order.metadata,
    // eslint-disable-next-line no-underscore-dangle
    _id: order._id,
  };
}

export function parseWebOrderToTotalum(
  webOrder: WebOrder
): Partial<TotalumOrder> {
  return {};
}
