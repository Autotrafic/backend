/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from "express";
import { CarModel } from "../../database/models/CarModel";
import CustomError from "../../errors/CustomError";
import { BrandModel, ExportBrand } from "../../database/models/Brand";
import calculateItp from "../../utils/itp";

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
      `Error loading all car brands. ${error}`
    );
    next(finalError);
  }
};

export const getAllBrandNames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brands: ExportBrand[] = await BrandModel.find({}, { brandName: 1 });
    res.status(200).json(brands);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      "Error loading brands.",
      `Error loading all car brand names. ${error}`
    );
    next(finalError);
  }
};

export const getFuels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { brandName, carYear } = req.body;

  try {
    const brand = await BrandModel.findOne({ brandName }).select({
      brandName: 1,
    });

    const fuels = await CarModel.find({
      modelOf: brand._id,
      startYear: { $lte: carYear },
      endYear: { $gte: carYear },
    }).distinct("fuel");

    res.status(200).json(fuels);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      "Error loading car fuels by models.",
      `Error loading car fuels by models.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
};

export const getModelNamesByFilters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { brandName, carYear, fuel } = req.body;

  try {
    const brand = await BrandModel.find({ brandName }).select({ brandName: 1 });

    const modelNames = await CarModel.find({
      modelOf: brand[0]._id,
      startYear: { $lte: carYear },
      endYear: { $gte: carYear },
      fuel,
    });

    res.status(200).json(modelNames);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      "Error loading car model names with filters.",
      `Error loading car model names with filters.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
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
      `Error loading car model by id.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
};

export const getItp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderData = req.body;

  try {
    const itpResponse = calculateItp(orderData);
    res.status(200).json({
      ITP: +itpResponse.ITP.toFixed(2),
      valorFiscal: +itpResponse.valorFiscal.toFixed(),
      imputacionItp: itpResponse.prevItpValue,
      valorDepreciacion: itpResponse.valorDepreciacion,
    });
  } catch (error) {
    const finalError = new CustomError(
      400,
      `Error calculating ITP value. ${error}`,
      `Error calculating ITP value.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
};
