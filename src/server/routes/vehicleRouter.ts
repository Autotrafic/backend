import express from "express";
import {
    getAllCars,
    getAllBrandNames,
    getModelNamesWithFilters,
    getModelById,
    getItp,
    getFuelsByModels,
} from "../controllers/carsController";
import {
    getAllElectricMotorbikeCCs,
    getAllFuelMotorbikeCCs,
} from "../controllers/motorBikesController";

const vehicleRouter = express.Router();

vehicleRouter.get("/", getAllCars);

vehicleRouter.get("/brands", getAllBrandNames);

vehicleRouter.post("/fuels", getFuelsByModels);

vehicleRouter.post("/models", getModelNamesWithFilters);

vehicleRouter.post("/model", getModelById);

vehicleRouter.get("/fuel-ccs", getAllFuelMotorbikeCCs);

vehicleRouter.get("/electric-ccs", getAllElectricMotorbikeCCs);

vehicleRouter.post("/itp", getItp);

export default vehicleRouter;
