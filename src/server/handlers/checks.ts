import { TCheck, TOTALUM_CHECKS } from '../../interfaces/checks';
import { addCheckToList } from '../../utils/funcs';
import { getOrdersPendingToShip } from '../services/totalum';

export async function checkShipmentAvailability(): Promise<TCheck[]> {
  let checks: TCheck[] = [];

  const ordersPendingToShip = await getOrdersPendingToShip();

  if (ordersPendingToShip.length < 1) {
    addCheckToList(checks, 'Envío', TOTALUM_CHECKS.ORDERS_WITHOUT_SHIPPING_ORDER);
    return checks;
  }

  const ordersWithoutShipment = ordersPendingToShip.filter((order) => order.envio.length < 1);
  const ordersWithShipment = ordersPendingToShip.filter((order) => order.envio.length > 0);

  const shipments = ordersWithShipment.map((order) => order.envio[0]);

  if (ordersWithoutShipment.length > 0) {
    for (let order of ordersWithoutShipment) {
      addCheckToList(checks, order.matricula, TOTALUM_CHECKS.ORDER_WITHOUT_ADDRESS);
    }
  }

  const checksConfig: { filterProp: keyof TotalumShipment; checkType: { id: number; title: string; type: string } }[] = [
    { filterProp: 'nombre_cliente', checkType: TOTALUM_CHECKS.SHIPMENT_WITHOUT_CUSTOMER_NAME },
    { filterProp: 'telefono', checkType: TOTALUM_CHECKS.SHIPMENT_WITHOUT_PHONE },
    { filterProp: 'direccion', checkType: TOTALUM_CHECKS.SHIPMENT_WITHOUT_ADDRESS },
    { filterProp: 'numero_domicilio', checkType: TOTALUM_CHECKS.SHIPMENT_WITHOUT_HOUSE_NUMBER },
    { filterProp: 'codigo_postal', checkType: TOTALUM_CHECKS.SHIPMENT_WITHOUT_POSTAL_CODE },
    { filterProp: 'localidad', checkType: TOTALUM_CHECKS.SHIPMENT_WITHOUT_CITY },
    { filterProp: 'referencia', checkType: TOTALUM_CHECKS.SHIPMENT_WITHOUT_REFERENCE },
  ];

  checksConfig.forEach(({ filterProp, checkType }) => {
    const shipmentsWithoutProp = shipments.filter((shipment) => {return !shipment[filterProp]});
    shipmentsWithoutProp.forEach((shipment) => {
      addCheckToList(checks, shipment.referencia, checkType);
    });
  });

  return checks;
}