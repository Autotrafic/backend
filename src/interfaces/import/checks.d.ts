import { Request } from "express";
import { TotalumOrder } from "../totalum/pedido";

export interface GetOrdersFindingsBody extends Request {
  body: TotalumOrder[];
}
