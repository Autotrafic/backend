import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import helmet from "helmet";
import { generalError, notFoundError } from "../errors/generalError";
import vehicleRouter from "./routes/vehicleRouter";
import paymentRouter from "./routes/paymentRouter";
import filesRouter from "./routes/filesRouter";
import csurf from "csurf";
import CustomError from "../errors/CustomError";

const app = express();

const csrfProtection = csurf({ cookie: true });

app.use(cors({credentials: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfProtection);


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

app.use("/vehicles", vehicleRouter);
app.use("/payment", paymentRouter);
app.use("/files", filesRouter);

app.get("/", (req, res) => res.send("Working!"));

app.get("/get-csrf-token", csrfProtection, (req, res, next) => {
    try {
        res.json({ csrfToken: req.csrfToken() });
    } catch (error) {
        const finalError = new CustomError(
            400,
            "Error generating csrf token.",
            "Error generating csrf token."
        );
        next(finalError);
    }
});

app.use(notFoundError);
app.use(generalError);

export default app;
