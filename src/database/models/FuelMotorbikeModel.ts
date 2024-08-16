import { model, Schema } from "mongoose";

export interface IMotorbike {
    id: Schema.Types.ObjectId;
    cc: string;
    value: number;
}

const fuelMotorbikeModelSchema = new Schema({
    id: Schema.Types.ObjectId,
    cc: String,
    value: Number,
});

export const MotorbikeModel = model(
    "FuelMotorbikeModel",
    fuelMotorbikeModelSchema,
    "fuel-motorbikes"
);
