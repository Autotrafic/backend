import express from "express";
import {
    generateReferralId,
    validateReferralId,
} from "../controllers/referralController";

const referralRouter = express.Router();

referralRouter.get("/id/generate", generateReferralId);
referralRouter.get("/id/validate", validateReferralId);

export default referralRouter;