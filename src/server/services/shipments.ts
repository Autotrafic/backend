import { TOrderState } from '../../interfaces/enums';
import { ExtendedTotalumShipment } from '../../interfaces/totalum/envio';
import { updateOrderById } from './totalum';

export async function updateTotalumOrderWhenShipped(shipmentsShipped: ExtendedTotalumShipment[]) {
  try {
    const updatePromises = shipmentsShipped.map((shipment) => {
      const orderId = shipment.pedido[0]._id;
      const update = { estado: TOrderState.PendienteEntregarCorreos };

      return updateOrderById(orderId, update);
    });

    await Promise.all(updatePromises);
  } catch (error) {
    throw new Error(error);
  }
}
