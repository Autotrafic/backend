import { Request } from "express";
import { DatabaseOrder } from "../../database/models/Order/WebOrder";

export interface CreateInformationFileBody extends Request {
    body: {
        orderData: DatabaseOrder;
        folderName: string;
    };
}