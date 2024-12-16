import { TExtendedOrder } from '../../interfaces/totalum/pedido';
import { getCurrentSpanishDate } from '../../utils/funcs';
import { parseTotalumOrderToMandateFileData } from '../parsers/totalum';

export function generateFileData(order: TExtendedOrder): MandateFileData {
  const mandateFileData = parseTotalumOrderToMandateFileData(order);

  validateMandateFileData(mandateFileData);

  return mandateFileData;
}

function validateMandateFileData(fileData: MandateFileData): boolean {
  const { client, company, orderType, vehiclePlate, actualDate } = fileData;
  let isValid = true;

  if (client.nif && company.nif) {
    if (!client.fullName) {
      throw new Error('El nombre del representante está vacío.');
      isValid = false;
    }
    if (!client.nif) {
      throw new Error('El NIF del representante está vacío.');
      isValid = false;
    }
    if (!client.address) {
      throw new Error('La dirección del representante está vacía.');
      isValid = false;
    }
    if (!company.fullName) {
      throw new Error('El nombre de la empresa está vacío.');
      isValid = false;
    }
    if (!company.nif) {
      throw new Error('El NIF de la empresa está vacío.');
      isValid = false;
    }
  } else {
    if (!client.fullName) {
      throw new Error('El nombre completo del cliente está vacío.');
      isValid = false;
    }
    if (!client.nif) {
      throw new Error('El NIF del cliente está vacío.');
      isValid = false;
    }
    if (!client.address) {
      throw new Error('La dirección del cliente está vacía.');
      isValid = false;
    }
  }

  if (!orderType) {
    throw new Error('El tipo de pedido está vacío.');
    isValid = false;
  }

  if (!vehiclePlate) {
    throw new Error('La matrícula del vehículo está vacía.');
    isValid = false;
  }

  if (!actualDate.year) {
    throw new Error('El año de la fecha actual está vacío.');
    isValid = false;
  }
  if (!actualDate.month) {
    throw new Error('El mes de la fecha actual está vacío.');
    isValid = false;
  }
  if (!actualDate.day) {
    throw new Error('El día de la fecha actual está vacío.');
    isValid = false;
  }

  return isValid;
}
