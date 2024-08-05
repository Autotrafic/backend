import express from "express";
import {
    getOrderById,
    registerOrder,
    updateNestedOrder,
    updateOrder,
} from "../controllers/orderController";
import {
    generateReferralId,
    validateReferralId,
} from "../controllers/referralController";

const orderRouter = express.Router();

orderRouter.get("/generate-referral-id", generateReferralId);
orderRouter.get("/validate-referral-id", validateReferralId);

orderRouter.get("/:orderId", getOrderById);
orderRouter.put("/:orderId", updateOrder);
orderRouter.put("/nested/:orderId", updateNestedOrder);
orderRouter.post("/register", registerOrder);

export default orderRouter;
