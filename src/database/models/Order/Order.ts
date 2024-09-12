import { AutonomousCommunityValue } from "../../../interfaces/enums";

export interface TotalumParsedOrder {
  autonomousCommunity: AutonomousCommunityValue;
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
