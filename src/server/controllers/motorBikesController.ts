import { NextFunction, Request, Response } from "express";
import CustomError from "../../errors/CustomError";
import { MotorbikeModel } from "../../database/models/FuelMotorbikeModel";
import { ElectricMotorbikeModel } from "../../database/models/ElectricMotorbikeModel";

export const getAllFuelMotorbikeCCs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const ccs = await MotorbikeModel.find({});
        res.status(200).json(ccs);
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error loading fuel motorbike ccs.",
            `Error loading fuel motorbike ccs. \n ${error}.
      Body: ${JSON.stringify(req.body)}`
        );
        next(finalError);
    }
};

export const getAllElectricMotorbikeCCs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const ccs = await ElectricMotorbikeModel.find({});
        res.status(200).json(ccs);
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error loading electric motorbike ccs.",
            `Error loading electric motorbike ccs. \n ${error}.
      Body: ${JSON.stringify(req.body)}`
        );
        next(finalError);
    }
};
