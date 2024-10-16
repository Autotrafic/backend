interface ParsedTotalumShipment {
  id: string;
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
