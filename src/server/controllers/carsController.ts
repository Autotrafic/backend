import { NextFunction, Request, Response } from "express";
import { CarModel } from "../../database/models/CarModel/CarModel";
import CustomError from "../../errors/CustomError";
import { BrandModel } from "../../database/models/Brand/Brand";

export const getAllCars = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const cars = await BrandModel.find({});
        res.status(200).json({ cars });
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

export const getBrandNames = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const brands = await BrandModel.find({}, { brandName: 1 });
        res.status(200).json(brands);
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

export const getSpecificModelNames = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { brandName, carYear } = req.body;

    try {
        const brand = await BrandModel.find({ brandName: brandName });

        const modelNames = await CarModel.find({
            modelOf: brand[0]._id,
            startYear: { $lte: carYear },
            endYear: { $gte: carYear },
        });

        res.status(200).json(modelNames);
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error loading models.",
            "Error loading models."
        );
        next(finalError);
    }
};

export const getModelById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.body;

    try {
        const model = await CarModel.findById(id);
        res.status(200).json(model);
    } catch (error) {
        const finalError = new CustomError(
            400,
            "Error finding model.",
            "Error finding model."
        );
        next(finalError);
    }
};

