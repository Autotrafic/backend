import { TOrderState } from '../../interfaces/enums';
import { ExtendedTotalumShipment, TotalumShipment } from '../../interfaces/totalum/envio';
import { updateOrderById, updateShipmentById } from './totalum';

export async function updateTotalumOrderWhenShipped(shipmentShipped: ExtendedTotalumShipment, parcel: ParcelResponse) {
  try {
    const updateOrdersPromises = shipmentShipped.pedido.map((order) => {
      const orderId = order._id;
      const update = { estado: TOrderState.PendienteEntregarCorreos };

      return updateOrderById(orderId, update);
    });

    await Promise.all(updateOrdersPromises);

    await updateShipmentById(shipmentShipped._id, {
      codigo_seguimiento: parcel.tracking_number,
      enlace_seguimiento: parcel?.tracking_url,
    });
  } catch (error) {
    throw new Error(`Error updating Totalum order state to 'Pendiente entregar Correos': ${error}`);
  }
}
