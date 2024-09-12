import { model, Schema } from "mongoose";

const primitiveOrderSchema = new Schema({
  comunidad_autonoma: String,
  prioridad: String,
  estado: String,
  tipo: String,
  fecha_inicio: String,
  factura: Object,
  matricula: String,
  documentos: String,
  direccion_envio: String,
  codigo_envio: String,
  cet: String,
  nuevo_contrato: Number,
  notas: String,
  itp_pagado: Number,
  total_facturado: Number,
  cliente: String,
  createdAt: String,
  updatedAt: String,
  metadata: Object,
  _id: String,
});

export const TotalumOrder = model(
  "TotalumOrder",
  primitiveOrderSchema,
  "totalum-orders"
);
