import { model, Schema } from "mongoose";

export interface CarModel {
    modelName: string;
    value: number;
    startYear: number;
    endYear: number;
    fuel: string;
    cc: number;
    cv: number;
    cvf: string;
    kWPower: number;
    cylindersNumber: number;
}

const carModelSchema = new Schema({
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

export const CarModel = model("CarModel", carModelSchema, "car-models");

