import { Readable } from "stream";
import { OrderData } from "./models";

export function createTextFile(data: string): Express.Multer.File {
    const fileStream = new Readable({
        read() {
            this.push(data);
            this.push(null);
        },
    });

    const virtualFile: Express.Multer.File = {
        buffer: fileStream.read() as Buffer,
        originalname: "Order Data.txt",
        mimetype: "text/plain",
    } as Express.Multer.File;

    return virtualFile;
}

export function formatDataForTextFile(data: string): string {
    const { vehicle, buyer, seller, customer, order } = JSON.parse(data);

    const vehicleInfo = `
- Vehículo (Datos no fiables):
    Matrícula: ${vehicle.plate}

    Tipo: ${vehicle.vehicleType}

    Precio de venta: ${vehicle.salePrice} €

    Fecha de matriculacion: ${vehicle.registrationDate}
`;

    const buyerInfo = `
- Comprador:
    Teléfono: ${buyer.phoneNumber}
`;

    const sellerInfo = `
- Vendedor:
    Teléfono: ${seller.phoneNumber}
`;

    const customerInfo = `
- Cliente:
    Comunidad autónoma: ${customer.community}

    Teléfono: ${customer.phoneNumber}

    Nombre completo: ${customer.fullName}

    Correo electrónico: ${customer.email}
`;

    const orderInfo = `
- Información adicional:
    Dirección de envío: ${order.shippingAddress}

    Precio ITP: ${order.itpPrice.toFixed(2)} €

    Precio total venta: ${order.totalPrice.toFixed(2)} €
`;

    return `
    ${vehicleInfo}
    
    ******************************************************

    ${buyerInfo}
    
    ******************************************************
    
    ${sellerInfo}
    
    ******************************************************
    
    ${customerInfo}
    
    ******************************************************
    
    ${orderInfo}
    `;
}
