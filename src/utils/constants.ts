import '../loadEnvironment';

const isTest = process.env.NODE_ENV !== 'production';

export const SENDCLOUD_API = 'https://panel.sendcloud.sc/api/v2/';

export const SHORT_URL_API = 'https://cleanuri.com/api/v1/shorten';

export const DOCUSEAL_API = 'https://api.docuseal.com';

const docusealProdKey = process.env.DOCUSEAL_API_KEY;
const docusealDevKey = process.env.DOCUSEAL_TEST_API_KEY;

export const docusealOptions = {
  'X-Auth-Token': isTest ? docusealDevKey : docusealProdKey,
  'content-type': 'application/json',
};

export const VEHICLE_TYPE = { CAR: 1, MOTORBIKE: 2, CARAVAN: 3 };

export const totalumOptions = {
  apiKey: {
    'api-key': process.env.TOTALUM_API_KEY,
  },
};

export const CUSTOMER_DRIVE_FOLDER_ID = '1lfiemHUd3-p9ATp29yRw7eEjzhixuB19';

export const EXPEDIENTES_DRIVE_FOLDER_ID = '1qwTqsyVwSHezV4PlBtDNF_MhWm3hqAeW';

export const ENVIOS_DRIVE_FOLDER_ID = '1hOlgna0fMPTfsKljzwicM6uVylq8Liy6';

export const STRIPE_PRODUCTS = {
  TRANSFERENCIA: 'prod_PbUwUKTHtDGawe',
  BAJA_VEHICULO: 'prod_QxJbS9ZhjS8MbW',
  ALTA_VEHICULO: 'prod_QXTxVliH7pShlZ',
  DUPLICADO_PERMISO: 'prod_QJdov39DNu1bnG',
  DISTINTIVO: 'prod_PcZsxLoFyxPfZV',
  ITP: 'prod_QcnA1jirsrhGBy',
  NOTA_SIMPLE: 'prod_QpOubhBiOQA483',
  IMPUESTOS: 'prod_QNmXu00iWhm3iF',
};

export const WHITELIST_IPS = [
  '::1',
  '::ffff:127.0.0.1',
  '93.176.145.122', // Wifi Cubelles
  '79.116.112.200', // Mobil Aron
  '79.116.120.191', // Mobil Aitor
  '79.117.90.131', // Mobil Personal Ovi
  '79.116.111.131', // Mobil T. Ovi
  '46.222.28.101', // Mobil Meri
];

export const ORDER_TYPES = {
  TRANSFERENCE: { taxValue: 55.7, hasShipment: true },
  TRANSFERENCE_CICL: { taxValue: 27.85, hasShipment: true },
  PERMIT_DUPLICATE: { taxValue: 20.81, hasShipment: true },
  NOTIFICATION: { taxValue: 8.67, hasShipment: false },
  DISTINCTIVE: { taxValue: 0, hasShipment: true },
  REGISTRATION: { taxValue: 99.77, hasShipment: true },
};

export const SHIPMENT_COST = 5.5;
