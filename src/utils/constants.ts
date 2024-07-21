export const VEHICLE_TYPE = { CAR: 1, MOTORBIKE: 2, CARAVAN: 3 };

export const CUSTOMER_FILES_DRIVE_FOLDER_ID =
    "1lfiemHUd3-p9ATp29yRw7eEjzhixuB19";

export const WHITELIST_IPS = [
    "::1",
    "::ffff:127.0.0.1",
    "93.176.145.122", // Wifi Cubelles
    "79.116.112.200", // Mobil Aron
    "79.116.120.191", // Mobil Aitor
    "79.117.90.131", // Mobil Personal Ovi
    "79.116.111.131", // Mobil T. Ovi
    "46.222.28.101", // Mobil Meri
];

export const ORDER_TYPES = {
    TRANSFERENCE: {taxValue: 55.7, hasShipment: true},
    TRANSFERENCE_CICL: {taxValue: 27.85, hasShipment: true},
    PERMIT_DUPLICATE: {taxValue: 20.81, hasShipment: true},
    NOTIFICATION: {taxValue: 8.67, hasShipment: false},
    DISTINCTIVE: {taxValue: 0, hasShipment: true},
    REGISTRATION: {taxValue: 99.77, hasShipment: true},
}

export const SHIPMENT_COST = 5.5;
