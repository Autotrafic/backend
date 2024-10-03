import { TOrderState } from '../../interfaces/enums';
import { ExtendedTotalumShipment, TotalumShipment } from '../../interfaces/totalum/envio';
import { shortUrl } from './other';
import { updateOrderById, updateShipmentById } from './totalum';

export async function updateTotalumOrderWhenShipped(shipmentShipped: ExtendedTotalumShipment, parcel: ParcelResponse) {
  try {
    const updateOrdersPromises = shipmentShipped.pedido.map((order) => {
      const orderId = order._id;
      const update = { estado: TOrderState.PendienteEntregarCorreos };

      return updateOrderById(orderId, update);
    });

    await Promise.all(updateOrdersPromises);

    const trackingUrlShortened = await shortUrl(parcel?.tracking_url);

    await updateShipmentById(shipmentShipped._id, {
      codigo_seguimiento: parcel.tracking_number,
      enlace_seguimiento: trackingUrlShortened,
    });
  } catch (error) {
    throw new Error(`Error updating Totalum order state to 'Pendiente entregar Correos': ${error}`);
  }
}
