import { model, Schema } from "mongoose";

export interface FuelMotorbikeModel {
    cc: string;
    value: number;
}

const fuelMotorbikeModelSchema = new Schema({
    cc: String,
    value: Number,
});

export const FuelMotorbikeModel = model(
    "FuelMotorbikeModel",
    fuelMotorbikeModelSchema,
    "fuel-motorbikes"
);

