import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { generalError, notFoundError } from "../errors/generalError";
import vehicleRouter from "./routes/vehicleRouter";
import paymentRouter from "./routes/paymentRouter";
import filesRouter from "./routes/filesRouter";
import csurf from "csurf";
import CustomError from "../errors/CustomError";

const app = express();

const csrfProtection = csurf({
    cookie: true,
    value: (req) => req.headers["csrf-token"] || req.body._csrf,
});

const corsOptions = {
    origin: "*", // Replace with the URL of your frontend
    credentials: true, // This allows cookies and credentials to be submitted across domains
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.options("*", cors(corsOptions));

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfProtection);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Specify the exact origin
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, CSRF-Token"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
});

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
