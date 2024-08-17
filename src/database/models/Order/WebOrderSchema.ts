import { model, Schema } from "mongoose";
import { AutonomousCommunityValue } from "../../enums";
import { IWebOrder } from "./WebOrder";

const orderCrossSellingSchema = new Schema({
    etiquetaMedioambiental: Boolean,
    informeDgt: Boolean,
});

const orderPricesSchema = new Schema({
    basePrice: Number,
    totalPrice: String,
    highTicketOrderFee: Number,
    referralDiscount: Number,
});

const orderITPSchema = new Schema({
    ITP: Number,
    valorFiscal: Number,
    imputacionItp: Number,
    valorDepreciacion: Number,
});

const orderBuyerSchema = new Schema({
    phoneNumber: String,
    shipmentAddress: String,
});

const orderSellerSchema = new Schema({
    phoneNumber: String,
});

const orderUserSchema = new Schema({
    fullName: String,
    phoneNumber: String,
    email: String,
    buyerCommunity: { type: String, enum: AutonomousCommunityValue },
});

const webOrderSchema = new Schema({
    orderDate: Date,
    orderId: String,
    isProduction: Boolean,
    isReferralValid: Boolean,
    itp: orderITPSchema,
    prices: orderPricesSchema,
    corssSelling: orderCrossSellingSchema,
    user: orderUserSchema,
    buyer: orderBuyerSchema,
    seller: orderSellerSchema,
    vehicle: { type: Schema.Types.Mixed },
});

const WebOrderModel = model<IWebOrder>("Order", webOrderSchema, "orders");
export default WebOrderModel;
