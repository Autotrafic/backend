import { model, Schema } from "mongoose";
import { ICar } from "./CarModel";

export interface Brand {
    brandName: string;
    models: ICar[];
}

export interface ExportBrand {
    brandName: string;
    id: string;
}

const brandSchema = new Schema({
    brandName: String,
    models: [{ type: Schema.Types.ObjectId, ref: "CarModel" }],
});

brandSchema.index({ brandName: 1 });

export const BrandModel = model("Brand", brandSchema, "car-brands");
