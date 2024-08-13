import { model, Schema } from "mongoose";

export interface User {
    fullName: string;
    phoneNumber: string;
    email: string;
    stripeId: string;
}

const userSchema = new Schema({
    fullName: String,
    phoneNumber: String,
    email: String,
    stripeId: String,
});

export const UserModel = model("User", userSchema, "users");
