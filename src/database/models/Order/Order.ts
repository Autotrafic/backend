import { model, Schema } from "mongoose";

export interface Order {
  autonomousCommunity: string;
  priority: string;
  state: string;
  type: string;
  startDate: Date;
  invoice: object;
  vehiclePlate: string;
  documentsLink: string;
  shipmentAddress: string;
  shipmentCode: string;
  notes: string;
  itpPaid: number;
  totalInvoiced: number;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  metadata: object;
  _id: string;
}

const orderSchema = new Schema({
  autonomousCommunity: String,
  priority: String,
  state: String,
  type: String,
  startDate: String,
  invoice: Object,
  vehiclePlate: String,
  documentsLink: String,
  shipmentAddress: String,
  shipmentCode: String,
  cetCode: String,
  newContractValue: Number,
  notes: String,
  itpPaid: Number,
  totalInvoiced: Number,
  clientId: String,
  createdAt: String,
  updatedAt: String,
  metadata: Object,
  _id: String,
});

export const Order = model("Order", orderSchema, "orders");
