/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import CustomError from "../../errors/CustomError";
import WebOrderModel from "../../database/models/Order/WebOrderSchema";
import {
  WebOrder,
  WebOrderDetails,
} from "../../database/models/Order/WebOrder";
import {
  CreateTotalumOrderBody,
  UpdateOrderByDocumentsDetailsBody,
} from "../../interfaces/import/order";
import { TotalumApiSdk } from "totalum-api-sdk";
import { totalumOptions } from "../../utils/constants";

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;

    const order = await WebOrderModel.findOne({ orderId });

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      "Error loading order.",
      `Error loading order. \n ${error}`
    );
    next(finalError);
  }
};

export const registerOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order: WebOrder = req.body;

    const actualOrder: IWebOrderToStore = {
      ...order,
      orderDate: new Date(),
    };

    const newOrder = new WebOrderModel(actualOrder);
    await newOrder.save();

    res.status(200).json({
      success: true,
      order: order.orderId,
    });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      "Error creating order.",
      `Error creating order. \n ${error}`
    );
    next(finalError);
  }
};

export async function createTotalumOrder(
  req: CreateTotalumOrderBody,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderId } = req.body;

    const order = await WebOrderModel.findOne({ orderId });

    // const totalumSdk = new TotalumApiSdk(totalumOptions);

    // async function createItem() {
    //   try {
    //     const response = await totalumSdk.crud.createItem("pedido", {
    //       comunidad_autonoma: "Cataluña",
    //       prioridad: "Normal",
    //       estado: "Pendiente Tramitar A9",
    //       tipo: "Transferencia",
    //       fecha_inicio: "2024-09-13",
    //       matricula: "exampleString",
    //       documentos: "exampleString",
    //       direccion_envio: "exampleString",
    //       codigo_envio: "exampleString",
    //       nuevo_contrato: 123,
    //       notas: "exampleString",
    //       itp_pagado: 123,
    //       fecha_de_contacto: "2015-03-25",
    //       total_facturado: 123,
    //       mandatos: "No enviados",
    //     });
    //     console.log(response.data);
    //   } catch (error) {
    //     console.error(error.toString());
    //     console.error(error?.response?.data);
    //   }
    // }

    // await createItem();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      `Error creating totalum order. \n ${error}`,
      `Error creating totalum order. \n ${error}`
    );
    next(finalError);
  }
}

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const { body: update } = req;

    const filter = { orderId };

    await WebOrderModel.findOneAndUpdate(filter, update);

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      "Error updating order.",
      `Error updating order. \n ${error}`
    );
    next(finalError);
  }
};

export const updateOrderWithDocumentsDetails = async (
  req: UpdateOrderByDocumentsDetailsBody,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const { body } = req;
    const { vehiclePlate, shipmentAddress, buyerPhone, sellerPhone } = body;

    const filter = { orderId };

    const orderDocument = await WebOrderModel.findOne(filter);

    if (!orderDocument) {
      const finalError = new CustomError(
        404,
        "Order not found.",
        `Order not found in database.`
      );
      return next(finalError);
    }

    const updatedVehicleData = {
      ...orderDocument.vehicle,
      plate: vehiclePlate,
    };

    const updatedUserData = {
      fullName: orderDocument.user.fullName,
      phoneNumber: orderDocument.user.phoneNumber,
      email: orderDocument.user.email,
      buyerCommunity: orderDocument.user.buyerCommunity,
      shipmentAddress: `${shipmentAddress.address}, ${shipmentAddress.postalCode} ${shipmentAddress.city}`,
    };

    const update: Partial<WebOrder & WebOrderDetails> = {
      vehicle: updatedVehicleData,
      user: updatedUserData,
      buyer: { phoneNumber: buyerPhone },
      seller: { phoneNumber: sellerPhone },
    };

    await WebOrderModel.updateOne(filter, {
      $set: update,
    });

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      "Error updating order.",
      `Error updating nested order. \n ${error}`
    );
    next(finalError);
  }
};

interface IWebOrderToStore extends WebOrder {
  orderDate: Date;
}
