import { NextFunction, Request, Response } from "express";
import CustomError from "../../errors/CustomError";
import WebOrderModel from "../../database/models/Order/WebOrderSchema";
import { IWebOrder } from "../../database/models/Order/WebOrder";

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
        const { body } = req;

        const filter = { orderId };
        const update = { ...body };

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

export const updateNestedOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { orderId } = req.params;
        const { body } = req;

        const filter = { orderId };

        const propertyOfUpdates = Object.keys(body)[0];
        const update: { [key: string]: any } = {};

        for (const key in body[propertyOfUpdates]) {
            update[`${propertyOfUpdates}.${key}`] =
                body[propertyOfUpdates][key];
        }

        const updatedOrder = await WebOrderModel.findOneAndUpdate(
            filter,
            update,
            {
                new: true,
                runValidators: true,
                upsert: true,
            }
        );

        if (!updatedOrder) {
            const finalError = new CustomError(
                404,
                "Order not found.",
                `Order not found in database.`
            );
            return next(finalError);
        }

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
