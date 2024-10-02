interface ParsedTotalumShipment {
  customerName: string;
  phone: string;
  address: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  email: string;
  reference: string;
  value: number;
  tracking: string;
}

interface CheckForShipmentSuccess {
  success: true;
  labelBase64: string;
}

interface CheckForShipmentFail {
  success: false;
  message: string;
}
