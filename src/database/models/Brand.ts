import { model, Schema } from "mongoose";
import { CarModel } from "./CarModel";

export interface Brand {
    brandName: string;
    models: CarModel[];
}

const brandSchema = new Schema({
    brandName: String,
    models: [{ type: Schema.Types.ObjectId, ref: "CarModel" }],
});

export const BrandModel = model("Brand", brandSchema, "car-brands");
