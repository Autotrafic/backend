import { TOrderState } from '../../interfaces/enums';
import { ExtendedTotalumShipment } from '../../interfaces/totalum/envio';
import { updateOrderById, updateShipmentById } from './totalum';

export async function updateTotalumOrderWhenShipped(
  shipmentShipped: ExtendedTotalumShipment,
  trackingInfo: { trackingNumber: string; trackingUrl: string; sendcloudParcelId: number }
) {
  try {
    const updateOrdersPromises = shipmentShipped.pedido.map((order) => {
      const orderId = order._id;
      const update = { estado: TOrderState.PendienteEntregarCorreos };

      return updateOrderById(orderId, update);
    });

    await Promise.all(updateOrdersPromises);

    await updateShipmentById(shipmentShipped._id, {
      codigo_seguimiento: trackingInfo.trackingNumber,
      enlace_seguimiento: trackingInfo.trackingUrl,
      sendcloud_parcel_id: trackingInfo.sendcloudParcelId,
    });
  } catch (error) {
    throw new Error(`Error updating Totalum order state to 'Pendiente entregar Correos': ${error}`);
  }
}
