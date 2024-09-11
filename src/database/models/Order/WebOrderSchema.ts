import { model, Schema } from "mongoose";
import { AutonomousCommunityValue } from "../../../interfaces/enums";
import { WebOrder, WebOrderDetails } from "./WebOrder";

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
});

const orderSellerSchema = new Schema({
    phoneNumber: String,
});

const orderUserSchema = new Schema({
    fullName: String,
    phoneNumber: String,
    email: String,
    buyerCommunity: { type: String, enum: AutonomousCommunityValue },
    shipmentAddress: String,
});

const webOrderSchema = new Schema({
    orderDate: Date,
    orderId: String,
    isProduction: Boolean,
    isReferralValid: Boolean,
    itp: orderITPSchema,
    prices: orderPricesSchema,
    crossSelling: orderCrossSellingSchema,
    vehicle: { type: Schema.Types.Mixed },
    user: orderUserSchema,
    buyer: orderBuyerSchema,
    seller: orderSellerSchema,
});

const WebOrderModel = model<WebOrder | (WebOrder & WebOrderDetails)>(
    "Order",
    webOrderSchema,
    "orders"
);
export default WebOrderModel;
