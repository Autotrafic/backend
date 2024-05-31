import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import { MulterFile } from "./models";

export function createTextFile(content: string): Promise<MulterFile> {
    return new Promise((resolve, reject) => {
        if (!existsSync("uploads/")) {
            mkdirSync("uploads/", { recursive: true });
        }

        const filePath = path.join("uploads/", "Información Adicional");

        writeFile(filePath, content, (err) => {
            if (err) {
                reject(err);
            } else {
                const fileDetails: MulterFile = {
                    fieldname: "uploadedFile",
                    originalname: "Información Adicional",
                    encoding: "7bit",
                    mimetype: "text/plain",
                    destination: "uploads/",
                    filename: "Información Adicional",
                    path: filePath,
                    size: Buffer.byteLength(content),
                };
                resolve(fileDetails);
            }
        });
    });
}

export function formatDataForTextFile(data: string): string {
    if (!data) return "";

    const { vehicle, buyer, seller, customer, plusServices, order } =
        JSON.parse(data);

    if (!vehicle && !buyer && !seller && !customer && !plusServices && !order)
        return "";

    const vehicleInfo = `
- Vehículo (Datos no fiables):
    Matrícula: ${vehicle.plate}

    Tipo: ${vehicle.vehicleType}

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

    const plusServicesInfo = `
- PRODUCTOS AÑADIDOS:
    Etiqueta medioambiental: ${plusServices.etiquetaMedioambiental}

    Informe DGT: ${plusServices.informeDgt}
`;

    const orderInfo = `
- Información adicional:
    Dirección de envío: ${order.shippingAddress}, ${order.postalCode}

    Precio ITP: ${order?.itpPrice ? order.itpPrice.toFixed(2) : 0} €

    Precio total venta: ${order?.totalPrice ? order.totalPrice.toFixed(2) : 0} €
`;

    return `
    ${
        plusServices &&
        `!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    ${plusServicesInfo}
    
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    `
    }

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
