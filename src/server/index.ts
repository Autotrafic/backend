import cors from "cors";
import express from "express";
import { generalError, notFoundError } from "../errors/generalError";
import vehicleRouter from "./routes/vehicleRouter";
import paymentRouter from "./routes/paymentRouter";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => res.send("Working!"));

app.use("/vehicles", vehicleRouter);
app.use("/payment", paymentRouter);

app.use(notFoundError);
app.use(generalError);

export default app;

