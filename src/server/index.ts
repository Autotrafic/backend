import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import { generalError, notFoundError } from "../errors/generalError";
import vehicleRouter from "./routes/vehicleRouter";
import paymentRouter from "./routes/paymentRouter";
import filesRouter from "./routes/filesRouter";
import logRouter from "./routes/logRouter";
import orderRouter from "./routes/orderRouter";
import messagesRouter from "./routes/messagesRouter";
import invoiceRouter from "./routes/invoiceRouter";
import referralRouter from "./routes/referralRouter";

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
});

app.use(limiter);
app.use(hpp());
app.use(cors());
app.use(bodyParser.json());
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
app.use(
    express.json({
        limit: "10kb",
    })
);
app.use(
    express.urlencoded({
        limit: "10kb",
        extended: true,
    })
);

app.get("/", (req, res) => res.send("Working!"));

app.use("/vehicles", vehicleRouter);
app.use("/payment", paymentRouter);
app.use("/files", filesRouter);
app.use("/logs", logRouter);
app.use("/order", orderRouter);
app.use("/messages", messagesRouter);
app.use("/invoice", invoiceRouter);
app.use("/referral", referralRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
