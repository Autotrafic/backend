import { ICar, VehicleType } from "../CarModel";
import { IMotorbike } from "../FuelMotorbikeModel";
import { AutonomousCommunityValue } from "../../enums";

export interface IWebOrder {
    orderId: string;
    isProduction: boolean;
    isReferralValid: boolean;
    itp: IOrderITP;
    prices: IOrderPrices;
    crossSelling: IOrderCrossSelling;
    vehicle: ICarSpecifications | IMotorbikeSpecifications;
    user: IRegisterOrderUser;
}

export interface IRegisterOrderUser {
    fullName: string;
    phoneNumber: string;
    email: string;
    buyerCommunity: AutonomousCommunityValue;
}

export interface ICarSpecifications extends ICar {
    type: VehicleType.CAR;
    registrationDate: string;
    brand: string;
}

export interface IMotorbikeSpecifications extends IMotorbike {
    type: VehicleType.MOTORBIKE;
    registrationDate: string;
}

interface IOrderCrossSelling {
    etiquetaMedioambiental: boolean;
    informeDgt: boolean;
}

interface IOrderPrices {
    basePrice: number;
    totalPrice: string;
    highTicketOrderFee: number;
    referralDiscount: number;
}

interface IOrderITP {
    ITP: number;
    valorFiscal: number;
    imputacionItp: number;
    valorDepreciacion: number;
}
