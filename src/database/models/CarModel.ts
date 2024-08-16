import { model, Schema } from "mongoose";
import { Fuel } from "../enums";

export interface ICar {
    id: Schema.Types.ObjectId;
    modelOf: string;
    modelName: string;
    value: number;
    startYear: number;
    endYear: number;
    fuel: Fuel;
    cc: number;
    cv: number;
    cvf: string;
    kWPower: number;
    cylindersNumber: number;
}

const carModelSchema = new Schema({
    id: Schema.Types.ObjectId,
    modelOf: { type: Schema.Types.ObjectId, ref: "Brand" },
    modelName: String,
    value: Number,
    startYear: Number,
    endYear: Number,
    fuel: String,
    cc: Number,
    cv: Number,
    cvf: String,
    kWPower: Number,
    cylindersNumber: Number,
});

export enum VehicleType {
    CAR = 1,
    MOTORBIKE = 2,
}

export const CarModel = model("CarModel", carModelSchema, "car-models");
