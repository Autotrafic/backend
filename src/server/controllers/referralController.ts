import { Request, Response, NextFunction } from "express";
import { nanoid } from "nanoid";
import CustomError from "../../errors/CustomError";
import Referral from "../../database/models/Referral";

const REFERRAL_ID_EXPIRATION_HOURS = 24;

export async function generateReferralId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { source } = req.body;

        const id = nanoid();
        const expiresAt = new Date(
            Date.now() + REFERRAL_ID_EXPIRATION_HOURS * 60 * 60 * 1000
        );

        const referral = new Referral({ id, expiresAt, source });

        await referral.save();
        res.status(201).json({
            id: referral.id,
            expiresAt: referral.expiresAt
        });
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error loading order.",
            `Error loading order. \n ${error}`
        );
        next(finalError);
    }
}

export async function validateReferralId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const referralId = req.params.id;
        const referral = await Referral.findOne({ id: referralId });

        if (referral) {
            if (new Date() < referral.expiresAt) {
                res.status(200).json({
                    valid: true,
                    message: "Referral ID is valid",
                });
            } else {
                res.status(400).json({
                    valid: false,
                    message: "Referral ID has expired",
                });
            }
        } else {
            res.status(400).json({
                valid: false,
                message: "Referral ID is invalid",
            });
        }
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error loading order.",
            `Error loading order. \n ${error}`
        );
        next(finalError);
    }
}
