import { NextFunction, Request, Response } from 'express';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import { getActualTrimesterExtendedOrders, getExtendedOrders, getOrderById } from '../services/totalum';
import { TotalumOrder } from '../../interfaces/totalum/pedido';

const totalumSdk = new TotalumApiSdk(totalumOptions);

interface Order extends TotalumOrder {
  socio_profesional: string;
}

export async function runScript(req: Request, res: Response, next: NextFunction) {
  try {
    const allOrders = await getActualTrimesterExtendedOrders();

    let incompleteOrders: any = [];
    allOrders.forEach((order: Order) => {
      if (!order.hasOwnProperty('cliente') && (!order.hasOwnProperty('socio_profesional') || !order.socio_profesional)) {
        incompleteOrders.push(order);
      }
    });

    if (incompleteOrders.length > 0) {
      res.status(200).json(incompleteOrders);
      return;
    }

    const ordersWithPartner = allOrders.filter(
      (order: Order) => order.hasOwnProperty('socio_profesional') && order.socio_profesional
    );
    const ordersWithoutPartner = allOrders.filter(
      (order: Order) => !order.hasOwnProperty('socio_profesional') || !order.socio_profesional
    );

    const setOrdersWithPartnerAddress = async (ordersWithPartner: Order[]) => {
        ordersWithPartner.forEach((order) => {

        })
    };

    res.status(200).json(ordersWithPartner.length + ordersWithoutPartner.length);
  } catch (error) {
    console.error(error);
  }
}
