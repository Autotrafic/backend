import { NextFunction, Request, Response } from "express";
import { Order } from "../../database/models/Order/Order";
import CustomError from "../../errors/CustomError";

export const getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({ orderId });

        res.status(200).json(order);
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error loading order.",
            "Error loading order."
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
        const order = req.body;
        order.generalData = order.vehicleForm;

        const newOrder = new Order(order);
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
            "Error creating order."
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
        const body = req.body;

        const filter = { orderId };
        const update = { ...body };

        await Order.findOneAndUpdate(filter, update);

        res.status(200).json({
            success: true,
            message: "Order updated successfully",
        });
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error updating order.",
            "Error updating order."
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
        const body = req.body;

        const filter = { orderId };

        const propertyOfUpdates = Object.keys(body)[0];
        const update: { [key: string]: any } = {};

        for (const key in body[propertyOfUpdates]) {
            update[`${propertyOfUpdates}.${key}`] =
                body[propertyOfUpdates][key];
        }

        const updatedOrder = await Order.findOneAndUpdate(filter, update, {
            new: true,
            runValidators: true,
            upsert: true
        });

        if (!updatedOrder) {
            const finalError = new CustomError(
                404,
                "Order not found.",
                "Order not found."
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
            "Error updating order."
        );
        next(finalError);
    }
};
