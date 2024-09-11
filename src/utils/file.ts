import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";
import { MulterFile } from "./models";
import { DatabaseOrder } from "../database/models/Order/WebOrder";

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

export function formatDataForTextFile(order: DatabaseOrder): string {
  if (!order) return "";

  const { vehicle, buyer, seller, user, crossSelling, itp, prices } = order;

  const vehicleInfo = `
- Vehículo (Datos no fiables):
    Matrícula: ${vehicle.plate}

    Tipo: ${vehicle.type}

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
    Comunidad autónoma: ${user.buyerCommunity}

    Teléfono: ${user.phoneNumber}

    Nombre completo: ${user.fullName}

    Correo electrónico: ${user.email}
`;

  const plusServicesInfo = `
- PRODUCTOS AÑADIDOS:
    Etiqueta medioambiental: ${crossSelling.etiquetaMedioambiental}

    Informe DGT: ${crossSelling.informeDgt}
`;

  const orderInfo = `
- Información adicional:
    Dirección de envío: ${user.shipmentAddress}

    Precio ITP: ${itp.ITP.toFixed(2)} €

    Precio total venta: ${Number(prices.totalPrice).toFixed(2)} €
`;

  return `
    ${
      crossSelling &&
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
