interface ParsedTotalumShipment {
  id: string;
  withSticker: boolean;
  customerName: string;
  phone: string;
  address: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  email: string;
  reference: string;
  value: number;
  trackingCode: string;
  trackingUrl: string;
  sendcloudParcelId: number
}

interface CheckForShipmentSuccess {
  success: true;
  labelBase64: string;
}

interface CheckForShipmentFail {
  success: false;
  message: string;
}

interface ShipmentNotificationData {
  clientName: string;
  vehiclePlate: string;
  address: string;
  isFastShipment: string;
  shipmentUrl: string;
}

type NotifyMessageType = 'sent' | 'pickup';