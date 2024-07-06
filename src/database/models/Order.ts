import { Schema, model } from "mongoose";
import { CarModel } from "./CarModel";
import { FuelMotorbikeModel } from "./FuelMotorbikeModel";

export interface IOrder {
    orderId: string;
    isProduction: boolean;
    vehicleForm: GeneralData;
    itp: Itp;
    prices: Prices;
    crossSelling: CrossSelling;
    billData: BillData;
}

interface GeneralData {
    vehicleType: 1 | 2 | 3;
    vehiclePlate: string;
    registrationDate: string;
    brand: string;
    model: CarModel;
    cc: FuelMotorbikeModel;
    buyerCommunity: string;
    phoneNumber: string;
}

interface BillData {
    email: string;
    fullName: string;
}

interface CrossSelling {
    etiquetaMedioambiental: boolean;
    informeDgt: boolean;
}

interface Prices {
    basePrice: number;
    totalPrice: string;
}

interface Itp {
    ITP: number;
    valorFiscal: number;
    imputacionItp: number;
    valorDepreciacion: number;
}

const GeneralDataSchema = new Schema({
    vehicleType: { type: Number, enum: [1, 2, 3], required: true },
    vehiclePlate: { type: String, required: false },
    registrationDate: { type: String, required: true },
    brand: { type: String, required: false },
    model: { type: Schema.Types.Mixed, required: false },
    cc: { type: Schema.Types.Mixed, required: false },
    buyerCommunity: { type: String, required: true },
    phoneNumber: { type: String, required: true },
});

const BillDataSchema = new Schema({
    email: { type: String, required: true },
    fullName: { type: String, required: true },
});

const CrossSellingSchema = new Schema({
    etiquetaMedioambiental: { type: Boolean, required: true },
    informeDgt: { type: Boolean, required: true },
});

const PricesSchema = new Schema({
    basePrice: { type: Number, required: true },
    totalPrice: { type: String, required: true },
});

const ItpSchema = new Schema({
    ITP: { type: Number, required: false },
    valorFiscal: { type: Number, required: false },
    imputacionItp: { type: Number, required: false },
    valorDepreciacion: { type: Number, required: false },
});

const OrderSchema = new Schema({
    orderId: { type: String, required: true },
    orderDate: { type: Date, required: true },
    isProduction: { type: Boolean, required: true },
    generalData: { type: GeneralDataSchema, required: true },
    itp: { type: ItpSchema, required: true },
    prices: { type: PricesSchema, required: true },
    crossSelling: { type: CrossSellingSchema, required: true },
    billData: { type: BillDataSchema, required: true },
});

export const Order = model<IOrder>("Order", OrderSchema, "orders");
