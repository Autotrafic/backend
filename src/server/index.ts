import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import { generalError, notFoundError } from "../errors/generalError";
import vehicleRouter from "./routes/vehicleRouter";
import paymentRouter from "./routes/paymentRouter";
import filesRouter from "./routes/filesRouter";
import { verifyCsrfHeader } from "../utils/security";

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(verifyCsrfHeader);

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://trusted.cdn.com"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    })
);

app.get("/", (req, res) => res.send("Working!"));

app.use("/vehicles", vehicleRouter);
app.use("/payment", paymentRouter);
app.use("/files", filesRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
