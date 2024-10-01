interface ParcelResponseObject {
  parcel: ParcelResponse;
}

interface ParcelRequest {
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
  parcel_items: ParcelItemRequest[];
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

interface ParcelResponse {
  id: number;
  reference: string;
  status: ParcelStatus;
  tracking_number: string;
  weight: string;
  order_number: string;
  total_insured_value: number;
  parcel_items: ParcelItemResponse[];
  documents: Document[];
  external_reference: string | null;
  is_return: boolean;
  note: string;
  total_order_value: string;
  total_order_value_currency: string;
  length: string;
  width: string;
  height: string;
  contract: string | null;
  address_divided: {
    street: string;
    house_number: string;
  };
  shipment: Shipment;
  shipping_method: number;
  shipping_method_checkout_name: string | null;
  insured_value: number;
  shipment_uuid: string;
  data: Record<string, any>;
  type: string | null;
  external_order_id: string;
  external_shipment_id: string;
  quantity: number;
  colli_uuid: string;
  collo_nr: number;
  collo_count: number;
  label: Record<string, any>;
  customs_declaration: Record<string, any>;
  to_state: string | null;
  date_created: string;
  date_announced: string | null;
  date_updated: string;
  customs_information: string | null;
  awb_tracking_number: string | null;
  box_number: string | null;
  customs_invoice_nr: string;
  customs_shipment_type: number;
  address: string;
  address_2: string;
  city: string;
  company_name: string;
  country: {
    iso_2: string;
    iso_3: string;
    name: string;
  };
  email: string;
  name: string;
  postal_code: string;
  telephone: string;
  to_post_number: string;
  to_service_point: string | null;
  carrier: {
    code: string;
  };
}

interface ParcelItemRequest {
  description: string;
  hs_code: string;
  origin_country: string;
  product_id: string;
  quantity: number;
  value: string;
  weight: string;
}

interface ParcelItemResponse {
  description: string;
  quantity: number;
  weight: string;
  value: string;
  hs_code: string;
  origin_country: string;
  product_id: string;
  variant_id: string | null;
  mid_code: string | null;
  material_content: string | null;
  intended_use: string | null;
  item_id: string | null;
  properties: Record<string, any>;
  sku: string;
  return_reason: string | null;
  return_message: string | null;
}

interface Shipment {
  id: number;
  name: string;
}

interface ParcelStatus {
  id: number;
  message: string;
}

interface Document {
  // Unknown
}
