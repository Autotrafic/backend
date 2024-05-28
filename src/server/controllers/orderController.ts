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

        const order = await Order.findOne({orderId});

        res.status(200).json(order);
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error loading brands.",
            "Error loading brands."
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

        res.status(200).json({ order });
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error loading brands.",
            "Error loading brands."
        );
        next(finalError);
    }
};
