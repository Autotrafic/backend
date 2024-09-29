import express from "express";
import { runScript } from "../controllers/scriptController";

const scriptRouter = express.Router();

scriptRouter.get("/", runScript);

export default scriptRouter;