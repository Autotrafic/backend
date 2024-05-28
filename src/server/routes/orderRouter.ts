import express from "express";
import { getOrderById, registerOrder } from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.get('/:orderId', getOrderById);
orderRouter.post("/register", registerOrder);

export default orderRouter;
