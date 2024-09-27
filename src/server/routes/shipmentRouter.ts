import express from "express";
import { createLabel } from "../controllers/shipmentController";

const shipmentRouter = express.Router();

shipmentRouter.post('/create-label', createLabel);

export default shipmentRouter;