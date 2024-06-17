import { Request, Response, NextFunction } from "express";
import client from "../middleweares/whatsappClient";
import CustomError from "../../errors/CustomError";

export const sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { phoneNumber, message } = req.body;

    const chatId = phoneNumber + "@c.us";

    try {
        const chat = await client.getChatById(chatId);

        const messages = await chat.fetchMessages({ limit: 1 });
        if (messages.length > 0) {
            res.send(`This chat contains previous messages.`);
        } else {
            await client.sendMessage(chatId, message);
            res.send("Message sent successfully.");
        }
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
