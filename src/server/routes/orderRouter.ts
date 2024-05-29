import express from "express";
import {
    getOrderById,
    registerOrder,
    updateNestedOrder,
    updateOrder,
} from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.get("/:orderId", getOrderById);
orderRouter.put("/:orderId", updateOrder);
orderRouter.put("/nested/:orderId", updateNestedOrder);
orderRouter.post("/register", registerOrder);

export default orderRouter;
