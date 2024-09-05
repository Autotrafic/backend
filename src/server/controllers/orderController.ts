/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import CustomError from "../../errors/CustomError";
import WebOrderModel from "../../database/models/Order/WebOrderSchema";
import {
    IWebOrder,
    WebOrderDetails,
} from "../../database/models/Order/WebOrder";
import { UpdateOrderByDocumentsDetailsBody } from "../../interfaces/import/order";

export const getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { orderId } = req.params;

        const order = await WebOrderModel.findOne({ orderId });

        res.status(200).json(order);
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error loading order.",
            `Error loading order. \n ${error}`
        );
        next(finalError);
    }
};

export const registerOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const order: IWebOrder = req.body;

        const actualOrder: IWebOrderToStore = {
            ...order,
            orderDate: new Date(),
        };

        const newOrder = new WebOrderModel(actualOrder);
        await newOrder.save();

        res.status(200).json({
            success: true,
            message: "Order registered successfully",
        });
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error creating order.",
            `Error creating order. \n ${error}`
        );
        next(finalError);
    }
};

export const updateOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { orderId } = req.params;
        const { body: update } = req;

        const filter = { orderId };

        await WebOrderModel.findOneAndUpdate(filter, update);

        res.status(200).json({
            success: true,
            message: "Order updated successfully",
        });
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error updating order.",
            `Error updating order. \n ${error}`
        );
        next(finalError);
    }
};

export const updateOrderWithDocumentsDetails = async (
    req: UpdateOrderByDocumentsDetailsBody,
    res: Response,
    next: NextFunction
) => {
    try {
        const { orderId } = req.params;
        const { body } = req;
        const { vehiclePlate, shipmentAddress, buyerPhone, sellerPhone } = body;

        const filter = { orderId };

        const orderDocument = await WebOrderModel.findOne(filter);

        if (!orderDocument) {
            const finalError = new CustomError(
                404,
                "Order not found.",
                `Order not found in database.`
            );
            return next(finalError);
        }

        const updatedVehicleData = {
            ...orderDocument.vehicle,
            plate: vehiclePlate,
        };

        const updatedUserData = {
            ...orderDocument.user,
            shipmentAddress: `${shipmentAddress.address}, ${shipmentAddress.postalCode} ${shipmentAddress.city}`,
        };

        const update: Partial<IWebOrder & WebOrderDetails> = {
            vehicle: updatedVehicleData,
            user: updatedUserData,
            buyer: { phoneNumber: buyerPhone },
            seller: { phoneNumber: sellerPhone },
        };

        await WebOrderModel.updateOne(filter, {
            $set: update,
        });

        res.status(200).json({
            success: true,
            message: "Order updated successfully",
        });
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error updating order.",
            `Error updating nested order. \n ${error}`
        );
        next(finalError);
    }
};

interface IWebOrderToStore extends IWebOrder {
    orderDate: Date;
}
