import {
    createStripeCustomer,
    updateStripeCustomer,
} from "../../server/services/stripe";
import { User, UserModel } from "../models/User";

export async function createUser(
    fullName: string,
    phoneNumber: string,
    email: string
) {
    try {
        const customer = { name: fullName, email, phone: phoneNumber };
        const stripeCustomer = await createStripeCustomer(customer);
        const stripeId = stripeCustomer.id;

        const newUserData = { fullName, phoneNumber, email, stripeId };
        const newUser = new UserModel(newUserData);
        await newUser.save();

        return newUser;
    } catch (error) {
        throw new Error(error);
    }
}

export async function updateUserByPhoneNumber(user: User) {
    try {
        const { fullName, phoneNumber, email, stripeId } = user;

        const filter = { phoneNumber };
        const update = { fullName, phoneNumber, email, stripeId };

        await updateStripeCustomer(update);
        await UserModel.findOneAndUpdate(filter, update);
    } catch (error) {
        throw new Error(error);
    }
}

export async function getUserByPhoneNumber(phoneNumber: string) {
    try {
        const filter = { phoneNumber };

        const user = await UserModel.findOne(filter);

        return user;
    } catch (error) {
        throw new Error(error);
    }
}
