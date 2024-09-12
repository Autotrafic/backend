import express from "express";
import {
  getOrderById,
  registerOrder,
  updateOrderWithDocumentsDetails,
  updateOrder,
  createTotalumOrder,
  updateTotalumOrderByDocumentsDetails,
  updateDriveDocumentsOfTotalumOrder,
} from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.post("/register", registerOrder);
orderRouter.post("/totalum/create", createTotalumOrder);
orderRouter.post(
  "/totalum/update-with-documents-details",
  updateTotalumOrderByDocumentsDetails
);
orderRouter.post('/totalum/update-documents-url', updateDriveDocumentsOfTotalumOrder);
orderRouter.post("/documentsDetails/:orderId", updateOrderWithDocumentsDetails);
orderRouter.post("/:orderId", updateOrder);
orderRouter.get("/:orderId", getOrderById);

export default orderRouter;
