import express from "express";
import {
    getOrderById,
    registerOrder,
    updateOrderWithDocumentsDetails,
    updateOrder,
} from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.post("/register", registerOrder);
orderRouter.post("/documentsDetails/:orderId", updateOrderWithDocumentsDetails);
orderRouter.post("/:orderId", updateOrder);
orderRouter.get("/:orderId", getOrderById);

export default orderRouter;
