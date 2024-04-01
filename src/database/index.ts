import "../loadEnvironment";
import mongoose from "mongoose";
import chalk from "chalk";

const connectDB = (mongoUrl: string) =>
    new Promise((resolve, reject) => {
        mongoose.set("toJSON", {
            virtuals: true,
            transform: (doc, ret) => {
                const newDocument = { ...ret };

                // eslint-disable-next-line no-underscore-dangle
                delete newDocument.__v;
                // eslint-disable-next-line no-underscore-dangle
                delete newDocument._id;
                delete newDocument.password;

                return newDocument;
            },
        });

        mongoose.set("strictQuery", false);

        try {
            console.log(mongoUrl)
            mongoose.connect(mongoUrl);

            console.log(
                chalk.bgBlue.white("Successfully connected with database")
            );
            resolve(true);
        } catch (error) {
            if (error) {
                console.log(
                    chalk.bgRed.white(
                        "An error occurred connecting with database",
                        error.message
                    )
                );
                reject(error);
                return;
            }
        }
    });

export default connectDB;

