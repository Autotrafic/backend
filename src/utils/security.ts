import { NextFunction, Request, Response } from "express";

export function verifyCsrfHeader(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.method === "POST" && !req.headers["x-requested-with"]) {
        return res.status(403).send("Missing CSRF header");
    }
    next();
}
