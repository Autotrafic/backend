import { NextFunction, Request, Response } from "express";
import CustomError from "../../errors/CustomError";
import { FuelMotorbikeModel } from "../../database/models/FuelMotorbikeModel/FuelMotorbikeModel";
import { ElectricMotorbikeModel } from "../../database/models/ElectricMotorbikeModel/ElectricMotorbikeModel";

export const getAllFuelMotorbikeCCs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const ccs = await FuelMotorbikeModel.find({});
        res.status(200).json(ccs);
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error loading fuel motorbike ccs.",
            `Error loading fuel motorbike ccs. \n ${error}`
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
            `Error loading electric motorbike ccs. \n ${error}`
        );
        next(finalError);
    }
};
