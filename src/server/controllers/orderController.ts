import { NextFunction, Request, Response } from 'express';
import CustomError from '../../errors/CustomError';
import WebOrderModel from '../../database/models/Order/WebOrderSchema';
import { DatabaseOrder, WebOrder, WebOrderDetails } from '../../database/models/Order/WebOrder';
import {
  CreateTotalumOrderBody,
  CreateTotalumOrderByIdBody,
  UpdateDriveDocumentsOfTotalumOrderBody,
  UpdateOrderByDocumentsDetailsBody,
  UpdateTotalumOrderByDocumentsDetailsBody,
} from '../../interfaces/import/order';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import { parseOrderFromWebToTotalum, parseRegisterWhatsappOrderBody } from '../parsers/order';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import { TTaskState } from '../../interfaces/enums';
import { createTask, createTotalumShipmentAndLinkToOrder } from '../services/totalum';
import {
  createExtendedOrderByWhatsappOrder,
  updateTotalumOrderFromDocumentsDetails,
  uploadWhatsappOrderFilesToDrive,
} from '../handlers/order';
import { TotalumShipment } from '../../interfaces/totalum/envio';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;

    const order = await WebOrderModel.findOne({ orderId });

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error loading order.',
      `Error loading order.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
};

export const registerOrder = async (req: Request, res: Response, next: NextFunction) => {
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
      'Error creating order.',
      `Error creating order.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const { body: update } = req;

    const filter = { orderId };

    await WebOrderModel.findOneAndUpdate(filter, update);

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error updating order.',
      `Error updating order.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
};

export async function registerWhatsappOrder(req: CreateTotalumOrderBody, res: Response, next: NextFunction) {
  try {
    const whatsappOrder = { ...req.body };
    const files = req.files as Express.Multer.File[];
    parseRegisterWhatsappOrderBody(whatsappOrder);

    const folderUrl = await uploadWhatsappOrderFilesToDrive(whatsappOrder, files);
    await createExtendedOrderByWhatsappOrder(whatsappOrder, 'folderUrl');

    res.status(201).json({
      success: true,
      message: 'Order created in Totalum successfully',
    });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      `Error registering whatsapp order. ${error}`,
      `Error registering whatsapp order.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}

export async function registerWebOrder(req: CreateTotalumOrderByIdBody, res: Response, next: NextFunction) {
  try {
    const { orderId } = req.body;

    const order: WebOrder = await WebOrderModel.findOne({ orderId });

    const newTotalumOrder = parseOrderFromWebToTotalum(order);

    const response = await totalumSdk.crud.createItem('pedido', newTotalumOrder);
    const newTotalumOrderId = response.data.data.insertedId;

    const shipment: Partial<TotalumShipment> = { con_distintivo: order.crossSelling.etiquetaMedioambiental ? 'Si' : 'No' };
    await createTotalumShipmentAndLinkToOrder(shipment, newTotalumOrderId);
    
    res.status(201).json({
      success: true,
      message: 'Order created in Totalum successfully',
      totalumOrderId: newTotalumOrderId,
    });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      `Error creating totalum order. ${error}`,
      `Error creating totalum order.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}

export async function extendTotalumOrderByDocumentsDetails(
  req: UpdateTotalumOrderByDocumentsDetailsBody,
  res: Response,
  next: NextFunction
) {
  try {
    const orderDetails = req.body;

    const databaseOrder: DatabaseOrder = await WebOrderModel.findOne({ orderId: orderDetails.orderId });

    await updateTotalumOrderFromDocumentsDetails(databaseOrder, orderDetails);

    res.status(200).json({ success: true, message: 'Order updated in Totalum successfully' });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      `Error updating totalum order. ${error}`,
      `Error updating totalum order.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}

export async function updateDriveDocumentsOfTotalumOrder(
  req: UpdateDriveDocumentsOfTotalumOrderBody,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderId, driveFolderId } = req.body;

    const order = (await WebOrderModel.findOne({ orderId })) as (WebOrder & WebOrderDetails) | null;
    const filter = { autotrafic_id: orderId };

    const response = await totalumSdk.crud.getItems('pedido', {
      filter: [filter],
    });

    const totalumOrder: TotalumOrder = response.data.data[0];
    const totalumOrderId = totalumOrder._id;

    const driveFolderUrl = `https://drive.google.com/drive/folders/${driveFolderId}`;

    const update: TotalumOrder = {
      ...totalumOrder,
      documentos: driveFolderUrl,
    };

    await totalumSdk.crud.editItemById('pedido', totalumOrderId, update);

    const firstTaskOptions = {
      state: TTaskState.Pending,
      description: 'Completar Totalum',
      url: driveFolderUrl,
      title: totalumOrder.matricula,
    };
    await createTask(firstTaskOptions);

    if (order && order.buyer) {
      const secondTaskOptions = {
        state: TTaskState.Pending,
        description: `Enviar provisional\n\n${order.buyer.phoneNumber}`,
        url: driveFolderUrl,
        title: `${totalumOrder.matricula} - Nuevo pedido web`,
      };
      await createTask(secondTaskOptions);
    }

    res.status(200).json({
      success: true,
      message: 'Order updated in Totalum successfully',
      totalumOrderId,
    });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      `Error updating totalum order. ${error}`,
      `Error updating totalum order.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}

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
      const finalError = new CustomError(404, 'Order not found.', `Order not found in database.`);
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
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error updating order.',
      `Error updating nested order.
      ${error}.
      
      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
};

interface IWebOrderToStore extends WebOrder {
  orderDate: Date;
}
