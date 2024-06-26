import { NextFunction, Request, Response } from "express";
import { WHITELIST_IPS } from "../../utils/constants";

export const checkIPWhitelist = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const clientIP =
        (req.headers["x-forwarded-for"] as string) ||
        req.connection.remoteAddress;

    if (WHITELIST_IPS.includes(clientIP)) {
        res.status(200).send(`Received from whitelisted IP: ${clientIP}.`);
    } else {
        next();
    }
};
