import express from "express";
import {
    getAllCars,
    getAllBrandNames,
    getModelNamesByBrandAndDate,
    getModelById,
    getItp,
    getFuelsByModels,
} from "../controllers/carsController";

const carsRouter = express.Router();

carsRouter.get("/", getAllCars);

carsRouter.get("/brands", getAllBrandNames);

carsRouter.get("/models", getModelNamesByBrandAndDate);

carsRouter.get("/fuels", getFuelsByModels);

carsRouter.get("/model", getModelById);

carsRouter.get("/itp", getItp);

export default carsRouter;

