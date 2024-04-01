import "../loadEnvironment";
import Debug from "debug";
import chalk from "chalk";
import app from "./index";
import CustomError from "../errors/CustomError";

const debug = Debug("server:startServer");

const startServer = (port: number) =>
    new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            console.log(
                chalk.bgGreen.white(`Server listening on port ${port}`)
            );
            resolve(true);
        });

        server.on("error", (error: CustomError) => {
            console.log(chalk.bgRed.white("Error when starting the server"));
            if (error.code === "EADDRINUSE") {
                console.log(chalk.bgRed.white(`Port ${port} is in use`));
            }
            reject(error);
        });
    });

export default startServer;
