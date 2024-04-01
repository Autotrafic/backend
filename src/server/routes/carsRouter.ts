import express from "express";
import {
    getAllCars,
    getBrandNames,
    getSpecificModelNames,
    getModelById,
    getItp,
} from "../controllers/carsController";

const carsRouter = express.Router();

carsRouter.get("/", getAllCars);

carsRouter.get("/brands", getBrandNames);

carsRouter.get("/models", getSpecificModelNames);

carsRouter.get("/model", getModelById);

carsRouter.get("/itp", getItp);

export default carsRouter;

