import cors from "cors";
import express from "express";
import { generalError, notFoundError } from "../errors/generalError";
import vehicleRouter from "./routes/vehicleRouter";

const app = express();

console.log(cors());
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => res.send("Working!"));

app.use("/vehicle", vehicleRouter);

app.use(notFoundError);
app.use(generalError);

export default app;

