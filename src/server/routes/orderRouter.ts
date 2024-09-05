import express from "express";
import {
    getOrderById,
    registerOrder,
    updateOrderWithDocumentsDetails,
    updateOrder,
} from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.get("/:orderId", getOrderById);
orderRouter.post("/:orderId", updateOrder);
orderRouter.post("/documentsDetails/:orderId", updateOrderWithDocumentsDetails);
orderRouter.post("/register", registerOrder);

export default orderRouter;
