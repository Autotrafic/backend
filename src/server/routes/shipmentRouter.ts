import express from "express";
import { createLabel, getPdfLabel } from "../controllers/shipmentController";

const shipmentRouter = express.Router();

shipmentRouter.post('/create-label', createLabel);
shipmentRouter.post('/get-pdf-label', getPdfLabel);

export default shipmentRouter;