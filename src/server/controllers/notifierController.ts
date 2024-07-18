import { NextFunction, Request, Response } from "express";
import CustomError from "../../errors/CustomError";
import notifySlack from "../services/notifier";

export default async function sendSlackMessage(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { message } = req.body;

        notifySlack(message);

        res.status(200).json("Message sent successfully.");
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error sending message to Slack.",
            `Error sending message to Slack. \n ${error}`
        );
        next(finalError);
    }
}
