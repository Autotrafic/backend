import express from "express";
import {
    getAllCars,
    getAllBrandNames,
    getModelNamesWithFilters,
    getModelById,
    getItp,
    getFuelsByModels,
} from "../controllers/carsController";

const carsRouter = express.Router();

carsRouter.get("/", getAllCars);

carsRouter.get("/brands", getAllBrandNames);

carsRouter.post("/fuels", getFuelsByModels);

carsRouter.post("/models", getModelNamesWithFilters);

carsRouter.post("/model", getModelById);

carsRouter.post("/itp", getItp);

export default carsRouter;

