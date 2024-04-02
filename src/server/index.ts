import cors from "cors";
import express from "express";
import { generalError, notFoundError } from "../errors/generalError";
import carsRouter from "./routes/carsRouter";

const app = express();

console.log(cors());
app.use(cors());


app.use(express.json());

app.get("/", (req, res) => res.send("Working!"));

app.use("/cars", carsRouter);

app.use(notFoundError);
app.use(generalError);

export default app;

