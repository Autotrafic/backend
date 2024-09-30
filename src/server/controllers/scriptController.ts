import { NextFunction, Request, Response } from 'express';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import { getActualTrimesterExtendedOrders, getExtendedOrders, getOrderById } from '../services/totalum';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import fetch from 'node-fetch';
import CustomError from '../../errors/CustomError';

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
      ordersWithPartner.forEach((order) => {});
    };

    res.status(200).json(ordersWithPartner.length + ordersWithoutPartner.length);
  } catch (error) {
    console.error(error);
  }
}

export async function runSecondScript(req: Request, res: Response, next: NextFunction) {
  const invoiceTemplateId = '668555647039d527e634233d';

  try {
    const options = {
      order: {
        type: 'Transferencia por finalizacion entrega',
        vehiclePlate: '7830GJW',
      },
      client: {
        name: 'IDAN CARS S.L.',
        firstSurname: null as null,
        secondSurname: null as null,
        nif: 'B09879255',
        address: 'CTRA PRAT DE LLUÇANES, NUM 326, 08208 SABADELL',
        phoneNumber: '683 36 13 86',
        email: null as null,
      },
      services: [
        {
          description: 'Tasa DGT',
          quantity: 1,
          priceWithoutIVA: '-',
          priceWithIVA: '-',
          totalPrice: '55.70',
        },
        {
          description: 'Envío',
          quantity: 1,
          priceWithoutIVA: '-',
          priceWithIVA: '-',
          totalPrice: '5.50',
        },
        {
          description: 'Honorarios',
          quantity: 1,
          priceWithoutIVA: '12.40',
          priceWithIVA: '15.00',
          totalPrice: '15.00',
        },
      ],
      summary: {
        totalIVA: '2.60',
        grandTotal: '76.20',
      },
      invoiceDate: '25 de septiembre de 2024',
      invoiceNumber: '417',
    };

    const fileName = `factura.pdf`;

    for (let i = 0; i < 40; i++) {
      try {
          const file = await totalumSdk.files.generatePdfByTemplate(invoiceTemplateId, options, fileName);
          const response = await fetch(file.data.data.url);
          await response.buffer();
      } catch (error) {
          throw new Error(error);
      }
  }

    res.status(201).json({ message: 'completed' });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error generating invoices.',
      `Error generating invoices.
      ${error}.`
    );
    next(finalError);
  }
}
