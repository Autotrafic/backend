import mongoose, { ObjectId, Schema, model } from "mongoose";
import { CarModel } from "../CarModel/CarModel";
import { FuelMotorbikeModel } from "../FuelMotorbikeModel/FuelMotorbikeModel";
import { ElectricMotorbikeModel } from "../ElectricMotorbikeModel/ElectricMotorbikeModel";

export interface IOrder {
    orderId: string;
    vehicleForm: GeneralData;
    itp: Itp;
    prices: Prices;
    crossSelling: CrossSelling;
    billData: BillData;
    documentsLaterData: DocumentsLater;
}

interface GeneralData {
    vehicleType: 1 | 2 | 3;
    registrationDate: string;
    brand: string;
    model: CarModel | FuelMotorbikeModel | ElectricMotorbikeModel;
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

interface DocumentsLater {
    vehiclePlate: string;
}

const GeneralDataSchema = new Schema({
    vehicleType: { type: Number, enum: [1, 2, 3], required: true },
    registrationDate: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: Schema.Types.Mixed, required: true },
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
    ITP: { type: Number, required: true },
    valorFiscal: { type: Number, required: true },
    imputacionItp: { type: Number, required: true },
    valorDepreciacion: { type: Number, required: true },
});

const DocumentsLaterSchema = new Schema({
    vehiclePlate: { type: String, required: true },
});

const OrderSchema = new Schema({
    orderId: { type: String, required: true, unique: true },
    generalData: { type: GeneralDataSchema, required: true },
    itp: { type: ItpSchema, required: true },
    prices: { type: PricesSchema, required: true },
    crossSelling: { type: CrossSellingSchema, required: true },
    billData: { type: BillDataSchema, required: true },
    documentsLaterData: { type: DocumentsLaterSchema, required: true },
});

export const Order = model<IOrder>("Order", OrderSchema, "orders");
