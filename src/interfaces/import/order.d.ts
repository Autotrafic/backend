import { Request } from 'express';
import { AutonomousCommunity, AutonomousCommunityValue, TOrderMandate, TOrderType } from '../enums';
import { DatabaseOrder } from '../../database/models/Order/WebOrder';
import { TotalumOrder } from '../totalum/pedido';

export interface UpdateOrderByDocumentsDetailsBody extends Request {
  body: OrderDetailsBody;
}

export interface CreateTotalumOrderByIdBody extends Request {
  body: {
    orderId: string;
  };
}

export interface CreateTotalumOrderBody extends Request {
  body: WhatsappOrder;
}

export interface WhatsappOrder {
  orderType: TOrderType;
  autonomousCommunity: AutonomousCommunity;
  firstTouchDate: Date;
  vehiclePlate: string;
  totalInvoiced: number;
  mandates: TOrderMandate;
  shipmentAddress: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  professionalPartner: WProfessionalPartner;
  collaborator: WCollaborator;
  buyer: WClient;
  seller: WClient;
}

interface WProfessionalPartner {
  id: string | null;
  driveId: string | null;
}

interface WCollaborator {
  id: string | null;
  phoneNumber: string | null;
  email: string | null;
}


interface WClient {
  clientType: TClientType;
  name: string;
  firstSurname: string;
  secondSurname: string;
  nif: string;
  phoneNumber: string;
  address: string;
  representative: { name: string; firstSurname: string; secondSurname: string; nif: string };
}

export interface OrderDetailsBody {
  vehiclePlate: string;
  shipmentAddress: { address: string; city: string; postalCode: string };
  buyerPhone: string;
  sellerPhone: string;
}

interface OrderDetailsBodyWithId extends OrderDetailsBody {
  orderId: string;
}

export interface UpdateTotalumOrderByDocumentsDetailsBody extends Request {
  body: OrderDetailsBodyWithId;
}

export interface UpdateDriveDocumentsOfTotalumOrderBody extends Request {
  body: { orderId: string; driveFolderId: string };
}

interface ITP {
  ITP: number;
  valorFiscal: number;
  imputacionItp: number;
  valorDepreciacion: number;
}

interface OrderPrices {
  basePrice: number;
  totalPrice: number;
  highTicketOrderFee: number;
  referralDiscount: number;
}

interface CrossSelling {
  etiquetaMedioambiental: boolean;
  informeDgt: boolean;
}

interface ICarSpecifications extends ICarModel {
  type: 1;
  registrationDate: string;
  brand: string;
}

interface IMotorbikeSpecifications extends IMotorbike {
  type: 2;
  registrationDate: string;
}

interface IRegisterOrderUser {
  fullName: string;
  phoneNumber: string;
  email: string;
  buyerCommunity: AutonomousCommunityValue;
}

interface ICarModel {
  modelName: string;
  cv: number;
  value: number;
  startYear: number;
  endYear: number;
  cc: number;
  cylindersNumber: number;
  fuel: Fuel;
  kwPower: number;
  cvf: string;
  modelOf: string;
  id: string;
}

interface IMotorbike {
  cc: MotorbikeCCRange;
  value: number;
  id: string;
}
