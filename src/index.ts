import "./loadEnvironment";
import connectDB from "./database";
import startServer from "./server/startServer";
import logMemoryUsage from "./utils/metrics";

const port = +process.env.PORT || 3100;

const mongoURL = process.env.MONGODB_URL;

(async () => {
    try {
        await connectDB(mongoURL);
        await startServer(port);
    } catch (error) {
        process.exit(1);
    }
})();
