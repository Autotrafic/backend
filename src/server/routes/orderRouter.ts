import express from "express";
import {
    getOrderById,
    registerOrder,
    updateOrderWithDocumentsDetails,
    updateOrder,
    createTotalumOrder,
} from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.post("/register", registerOrder);
orderRouter.post("/create-totalum", createTotalumOrder);
orderRouter.post("/documentsDetails/:orderId", updateOrderWithDocumentsDetails);
orderRouter.post("/:orderId", updateOrder);
orderRouter.get("/:orderId", getOrderById);

export default orderRouter;
