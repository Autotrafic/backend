import express from "express";
import {
  getAllCars,
  getAllBrandNames,
  getModelNamesFirstStep,
  getModelById,
  getItp,
  getFuels,
} from "../controllers/carsController";
import {
  getAllElectricMotorbikeCCs,
  getAllFuelMotorbikeCCs,
} from "../controllers/motorBikesController";

const vehicleRouter = express.Router();

vehicleRouter.get("/", getAllCars);

vehicleRouter.get("/brands", getAllBrandNames);

vehicleRouter.post("/fuels", getFuels);

vehicleRouter.post("/models", getModelNamesFirstStep);

vehicleRouter.post("/model", getModelById);

vehicleRouter.get("/fuel-ccs", getAllFuelMotorbikeCCs);

vehicleRouter.get("/electric-ccs", getAllElectricMotorbikeCCs);

vehicleRouter.post("/itp", getItp);

export default vehicleRouter;
