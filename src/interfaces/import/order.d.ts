import { Request } from "express";
import { AutonomousCommunityValue } from "../enums";

export interface UpdateOrderByDocumentsDetailsBody extends Request {
  body: {
    vehiclePlate: string;
    shipmentAddress: { address: string; city: string; postalCode: string };
    buyerPhone: string;
    sellerPhone: string;
  };
}

export interface CreateTotalumOrderBody extends Request {
  body: {
    orderId: string;
  };
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
