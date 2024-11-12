import { NextFunction, Request, Response } from 'express';
import CustomError from '../../errors/CustomError';
import WebOrderModel from '../../database/models/Order/WebOrderSchema';
import { WebOrder, WebOrderDetails } from '../../database/models/Order/WebOrder';
import {
  CreateTotalumOrderBody,
  CreateTotalumOrderByIdBody,
  UpdateDriveDocumentsOfTotalumOrderBody,
  UpdateOrderByDocumentsDetailsBody,
  UpdateTotalumOrderByDocumentsDetailsBody,
} from '../../interfaces/import/order';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { EXPEDIENTES_DRIVE_FOLDER_ID, totalumOptions } from '../../utils/constants';
import { parseOrderDetailsFromWebToTotalum, parseOrderFromWebToTotalum } from '../parsers/order';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import { TTaskState } from '../../interfaces/enums';
import { createExtendedOrderByWhatsappOrder, createTask } from '../services/totalum';
import { getOrderFolder, uploadStreamFileToDrive } from '../services/googleDrive';

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
    const whatsappOrder = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).send(`No file uploaded. Files: ${files}`);
      return;
    }

    const orderFolderId = await getOrderFolder(whatsappOrder.vehiclePlate, EXPEDIENTES_DRIVE_FOLDER_ID);
    const folderUrl = `https://drive.google.com/drive/folders/${orderFolderId}`;

    for (const file of files) {
      await uploadStreamFileToDrive(file, orderFolderId);
    }

    await createExtendedOrderByWhatsappOrder(whatsappOrder, folderUrl);

    const createTaskOptions = {
      state: TTaskState.Pending,
      description: 'Completar Totalum',
      url: folderUrl,
      title: whatsappOrder.vehiclePlate,
    };
    await createTask(createTaskOptions);

    res.status(201).json({
      success: true,
      message: 'Order created in Totalum successfully',
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

export async function createTotalumOrderById(req: CreateTotalumOrderByIdBody, res: Response, next: NextFunction) {
  try {
    const { orderId } = req.body;

    const order: WebOrder = await WebOrderModel.findOne({ orderId });

    const newTotalumOrder = parseOrderFromWebToTotalum(order);

    const response = await totalumSdk.crud.createItem('pedido', newTotalumOrder);

    const newTotalumOrderId = response.data.data.insertedId;

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

export async function updateTotalumOrderByDocumentsDetails(
  req: UpdateTotalumOrderByDocumentsDetailsBody,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderId } = req.body;

    const filter = { autotrafic_id: orderId };

    const response = await totalumSdk.crud.getItems('pedido', {
      filter: [filter],
    });

    const totalumOrder: TotalumOrder = response.data.data[0];
    const totalumOrderId = totalumOrder._id;

    const parsedOrderDetails = parseOrderDetailsFromWebToTotalum(req.body);
    const notas = totalumOrder.notas.replace('Esperando documentación del cliente. ', '');
    const update: TotalumOrder = {
      ...totalumOrder,
      ...parsedOrderDetails,
      notas,
    };

    await totalumSdk.crud.editItemById('pedido', totalumOrderId, update);

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

export async function updateDriveDocumentsOfTotalumOrder(
  req: UpdateDriveDocumentsOfTotalumOrderBody,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderId, driveFolderId } = req.body;

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

    const createTaskOptions = {
      state: TTaskState.Pending,
      description: 'Completar Totalum',
      url: driveFolderUrl,
      title: totalumOrder.matricula,
    };
    await createTask(createTaskOptions);

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
