import { Check, CheckType, TCheck } from '../../interfaces/checks';
import { TotalumShipment } from '../../interfaces/totalum/envio';
import { FIELD_CONDITIONS, handleOrdersWithWrongNumberOfShipments } from '../../utils/checks';
import { getOrdersPendingToShip } from '../services/totalum';

export async function checkShipmentAvailability(): Promise<{ passedChecks: TCheck[]; failedChecks: TCheck[] }> {
  const passedChecks: TCheck[] = [];
  const failedChecks: TCheck[] = [];

  const ordersPendingToShip = await getOrdersPendingToShip();

  const ordersWithoutShipment = ordersPendingToShip.filter((order) => !order.envio || order.envio.length < 1);
  const ordersWithMultipleShipments = ordersPendingToShip.filter((order) => order.envio && order.envio.length > 1);
  const ordersWithOneShipment = ordersPendingToShip.filter((order) => order.envio && order.envio.length === 1);

  handleOrdersWithWrongNumberOfShipments(failedChecks, ordersWithoutShipment, ordersWithMultipleShipments);

  const shipments = ordersWithOneShipment.map((order) => order.envio[0]);

  shipments.forEach((shipment) => {
    const shipmentChecks: Check[] = [];
    let hasError = false;

    for (const [field, conditions] of Object.entries(FIELD_CONDITIONS)) {
      const fieldValue = shipment[field as keyof TotalumShipment];

      conditions.forEach(({ check, checkInfo }) => {
        if (!check(fieldValue as string)) {
          shipmentChecks.push(checkInfo);
          hasError = true;
        }
      });
    }

    if (!hasError) {
      shipmentChecks.push({ title: 'El pedido está listo para enviar', type: CheckType.GOOD });
    }

    const passed = shipmentChecks.filter((check) => check.type === CheckType.GOOD);
    const failed = shipmentChecks.filter((check) => check.type !== CheckType.GOOD);

    if (passed.length > 0) {
      passedChecks.push({ reference: shipment.referencia, shipmentId: shipment._id, checks: passed });
    }
    if (failed.length > 0) {
      failedChecks.push({ reference: shipment.referencia, shipmentId: shipment._id, checks: failed });
    }
  });

  return { passedChecks, failedChecks };
}
