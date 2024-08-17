import express from "express";
import {
    getOrderById,
    registerOrder,
    updateOrderNestedProperties,
    updateOrder,
} from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.get("/:orderId", getOrderById);
orderRouter.post("/:orderId", updateOrder);
orderRouter.post("/nested/:orderId", updateOrderNestedProperties);
orderRouter.post("/register", registerOrder);

export default orderRouter;
