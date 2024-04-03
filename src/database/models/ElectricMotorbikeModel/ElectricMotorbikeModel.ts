import { model, Schema } from "mongoose";

export interface ElectricMotorbikeModel {
    power: string;
    value: number;
}

const electricMotorbikeModelSchema = new Schema({
    power: String,
    value: Number,
});

export const ElectricMotorbikeModel = model(
    "ElectricMotorbikeModel",
    electricMotorbikeModelSchema,
    "electric-motorbikes"
);

