import "./loadEnvironment";
import connectDB from "./database";
import startServer from "./server/startServer";

const http = require("http");

const port = +process.env.PORT || 3100;

const mongoURL = process.env.MONGODB_URL;

(async () => {
    try {
        console.log('one');
        await connectDB(mongoURL);
        await startServer(port);
        console.log('two');
    } catch (error) {
        process.exit(1);
    }
})();