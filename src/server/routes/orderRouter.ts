import express from "express";
import {
  getOrderById,
  registerOrder,
  updateOrderWithDocumentsDetails,
  updateOrder,
  createTotalumOrder,
  updateTotalumOrderByDocumentsDetailsBody,
} from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.post("/register", registerOrder);
orderRouter.post("/totalum/create", createTotalumOrder);
orderRouter.post(
  "/totalum/update-with-documents-details",
  updateTotalumOrderByDocumentsDetailsBody
);
orderRouter.post("/documentsDetails/:orderId", updateOrderWithDocumentsDetails);
orderRouter.post("/:orderId", updateOrder);
orderRouter.get("/:orderId", getOrderById);

export default orderRouter;
