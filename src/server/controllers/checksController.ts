import { NextFunction, Response } from 'express';
import { GetOrdersFindingsBody } from '../../interfaces/import/checks';
import { TCheck, TOTALUM_CHECKS } from '../../interfaces/checks';
import { addCheckToList } from '../../utils/funcs';
import { getClientById, getShipmentNestedData, getShipmentsForShip } from '../services/totalum';
import CustomError from '../../errors/CustomError';

export async function getOrdersChecksForShipment(req: GetOrdersFindingsBody, res: Response, next: NextFunction) {
  let foundedChecks: TCheck[] = [{ reference: '', checks: [] }];

  // function formatClientName(client) {
  //   return `${client.nombre_o_razon_social} ${client.primer_apellido ?? ''} ${client.segundo_apellido ?? ''}`.trim();
  // }

  // async function processOrder(order) {
  //   if (!order.cliente) {
  //     alert(`Expediente con matrícula ${order.matricula} no tiene ningún cliente asociado.`);
  //     return null;
  //   }

  //   const client = await getClientById(order.cliente);
  //   if (!client || !client.nombre_o_razon_social) {
  //     alert(`Expediente con matrícula ${order.matricula} tiene asociado un cliente sin nombre.`);
  //     return null;
  //   }

  //   const orderDetails = {
  //     vehiclePlate: order.matricula,
  //     shipmentAddress: order.direccion_envio,
  //     clientName: formatClientName(client),
  //     clientPhoneNumber: client.telefono ? parsePhoneNumber(client.telefono) : '',
  //   };

  //   return { orderDetails, client };
  // }

  // function groupByShipmentAddress(shipments: Shipment[]): Shipment[][] {
  //   if (shipments.length < 1) return null;

  //   const grouped: { [key: string]: Shipment[] } = {};

  //   shipments.forEach((shipment) => {
  //     const address = shipment.shipmentAddress;
  //     if (!grouped[address]) {
  //       grouped[address] = [];
  //     }
  //     grouped[address].push(shipment);
  //   });
  //   const result = Object.values(grouped);

  //   return result.length > 0 ? result : null;
  // }

  // function filterOriginalArray(allOrders: Shipment[], groupedOrders: Shipment[][]): Shipment[] {
  //   if (!groupedOrders) return allOrders;
  //   const groupedSet = new Set<string>();

  //   groupedOrders.forEach((group) => {
  //     group.forEach((order) => {
  //       groupedSet.add(order.vehiclePlate);
  //     });
  //   });

  //   return allOrders.filter((order) => !groupedSet.has(order.vehiclePlate));
  // }

  try {
    // const allOrders = req.body;

    // const ordersToShip = allOrders.filter((order) => order.estado === 'Pendiente Envío Cliente');
    // if (ordersToShip.length < 1) {
    //   alert('No hay pedidos pendientes de envío');
    //   res.status(200).json({ success: false, check: TOTALUM_CHECKS.ORDERS_WITHOUT_SHIPPING_ORDER });
    // }

    // const ordersWithoutAddress = ordersToShip.filter((order) => order.direccion_envio === null);
    // const ordersWithAddress = ordersToShip.filter((order) => order.direccion_envio !== null && order.direccion_envio !== '');

    // // Orders without address
    // if (ordersWithoutAddress.length > 0) {
    //   for (let order of ordersWithoutAddress) {
    //     addCheckToList(foundedChecks, order.matricula, TOTALUM_CHECKS.ORDER_WITHOUT_ADDRESS);
    //   }
    // }

    const shipments = await getShipmentsForShip();

    res.json(shipments);

    // let documentOrders = [];
    // let documentOrdersWithSameAddress = [];

    // for (let order of ordersWithAddress) {
    //   const { orderDetails } = await processOrder(order);
    //   documentOrders.push(orderDetails);
    // }

    // for (let orderToIterate of documentOrders) {
    //   for (let order of documentOrders) {
    //     if (
    //       orderToIterate.shipmentAddress === order.shipmentAddress &&
    //       orderToIterate.vehiclePlate !== order.vehiclePlate &&
    //       orderToIterate.shipmentAddress !== '' &&
    //       orderToIterate.shipmentAddress !== null
    //     ) {
    //       documentOrdersWithSameAddress.push(orderToIterate);
    //     }
    //   }
    // }

    // const groupedOrdersWithSameAddress = groupByShipmentAddress(documentOrdersWithSameAddress);
    // const filteredOrdersWithDifferentAddress = filterOriginalArray(documentOrders, groupedOrdersWithSameAddress);
    // const numberOfOrders = ordersWithAddress.length;
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      500,
      'Error getting checks for shipment.',
      `Error getting checks for shipment.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}
