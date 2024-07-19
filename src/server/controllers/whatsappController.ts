import "../../loadEnvironment";
import { Request, Response, NextFunction } from "express";
import axios from "axios";
import CustomError from "../../errors/CustomError";

const whatsAppEndpoint = `${process.env.AUTOTRAFIC_WHATSAPP}/messages/first-touch-whtspp`;

export default async function sendMessage(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const { phoneNumber, message } = req.body;

    try {
        const response = await axios.post(whatsAppEndpoint, {
            phoneNumber,
            message,
        });

        res.send(response.data);
    } catch (error) {
        const finalError = new CustomError(
            500,
            `Error sending WhatsApp message. \n ${error}`,
            `Error sending WhatsApp message. \n ${error}`
        );
        next(finalError);
    }
}
