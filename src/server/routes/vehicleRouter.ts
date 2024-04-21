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
import csurf from "csurf";

const vehicleRouter = express.Router();

const csrfProtection = csurf({ cookie: true });

vehicleRouter.get("/", csrfProtection, getAllCars);

vehicleRouter.get("/brands", csrfProtection, getAllBrandNames);

vehicleRouter.post("/fuels", csrfProtection, getFuelsByModels);

vehicleRouter.post("/models", csrfProtection, getModelNamesWithFilters);

vehicleRouter.post("/model", csrfProtection, getModelById);

vehicleRouter.get("/fuel-ccs", csrfProtection, getAllFuelMotorbikeCCs);

vehicleRouter.get("/electric-ccs", csrfProtection, getAllElectricMotorbikeCCs);

vehicleRouter.post("/itp", csrfProtection, getItp);

export default vehicleRouter;
