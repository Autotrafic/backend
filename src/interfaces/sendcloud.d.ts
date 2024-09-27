interface Parcel {
  reference: string;
  name: string;
  telephone: string;
  address: string;
  house_number: string;
  postal_code: string;
  city: string;
  country: string;
  country_state: string | null;
  email: string;
  customs_invoice_nr: string;
  customs_shipment_type: number;
  parcel_items: ParcelItem[];
  weight: string;
  length: string;
  width: string;
  height: string;
  total_order_value: string;
  total_order_value_currency: string;
  shipment: Shipment;
  quantity: number;
  total_insured_value: number;
  is_return: boolean;
  request_label: boolean;
  apply_shipping_rules: boolean;
  request_label_async: boolean;
}

interface ParcelItem {
  description: string;
  hs_code: string;
  origin_country: string;
  product_id: string;
  quantity: number;
  value: string;
  weight: string;
}

interface Shipment {
  id: number;
  name: string;
}
