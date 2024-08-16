import { model, Schema } from "mongoose";
import { VehicleType } from "../CarModel";
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

const orderUserSchema = new Schema({
    fullName: String,
    phoneNumber: String,
    email: String,
    buyerCommunity: { type: String, enum: AutonomousCommunityValue },
});

const carSpecificationsSchema = new Schema({
    id: Schema.Types.ObjectId,
    type: { type: Number, enum: [VehicleType.CAR] },
    registrationDate: String,
    brand: String,
    value: Number,
    modelOf: String,
    modelName: String,
    startYear: Number,
    endYear: Number,
    fuel: String,
    cc: Number,
    cv: Number,
    cvf: String,
    kWPower: Number,
    cylindersNumber: Number,
});

const motorbikeSpecificationsSchema = new Schema({
    id: Schema.Types.ObjectId,
    type: { type: Number, enum: [VehicleType.MOTORBIKE] },
    registrationDate: String,
    cc: String,
    value: Number,
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
    vehicle: { type: Schema.Types.Mixed },
});

const WebOrderModel = model<IWebOrder>("Order", webOrderSchema, "orders");
export default WebOrderModel;

// const webOrderSchemaWithCarSpecifications = new Schema({
//     orderDate: Date,
//     orderId: String,
//     isProduction: Boolean,
//     isReferralValid: Boolean,
//     itp: orderITPSchema,
//     prices: orderPricesSchema,
//     corssSelling: orderCrossSellingSchema,
//     user: orderUserSchema,
//     vehicle: carSpecificationsSchema,
// });

// const webOrderSchemaWithMotorbikeSpecifications = new Schema({
//     orderDate: Date,
//     orderId: String,
//     isProduction: Boolean,
//     isReferralValid: Boolean,
//     itp: orderITPSchema,
//     prices: orderPricesSchema,
//     corssSelling: orderCrossSellingSchema,
//     user: orderUserSchema,
//     vehicle: motorbikeSpecificationsSchema,
// });

// export const WebOrderModelWithCarSpecifications = model<IWebOrder>(
//     "Order",
//     webOrderSchemaWithCarSpecifications,
//     "orders"
// );
// export const WebOrderModelWithMotorbikeSpecifications = model<IWebOrder>(
//     "Order",
//     webOrderSchemaWithMotorbikeSpecifications,
//     "orders"
// );

// export function getOrderModelByVehicleType(vehicleType: VehicleType) {
//     return vehicleType === VehicleType.CAR
//         ? WebOrderModelWithCarSpecifications
//         : WebOrderModelWithMotorbikeSpecifications;
// }
