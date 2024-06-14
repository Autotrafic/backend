import { Request, Response, NextFunction } from "express";
import client from "../middleweares/whatsappClient";
import CustomError from "../../errors/CustomError";

export const sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { phoneNumber, message } = req.body;

    try {
        await client.sendMessage(`${phoneNumber}@c.us`, message);
        res.send("Message sent successfully.");
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            500,
            "Error loading order.",
            "Error loading order."
        );
        next(finalError);
    }
};
