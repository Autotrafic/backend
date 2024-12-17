import { TExtendedOrder } from '../../interfaces/totalum/pedido';
import { getCurrentSpanishDate } from '../../utils/funcs';
import { parsePhoneNumberToE164 } from './other';

export function parseTotalumOrderToMandateFileData(order: TExtendedOrder): MandateData {
  const { cliente, matricula, tipo } = order;
  const representante = cliente.representante;
  const phoneNumber = parsePhoneNumberToE164(cliente.telefono);

  const clientFullName = `${cliente.nombre_o_razon_social} ${cliente.primer_apellido || ''} ${
    cliente.segundo_apellido || ''
  }`.trim();

  let clientData: MandateClient;
  if (representante && representante.nif) {
    clientData = {
      fullName: representante.nombre_o_razon_social,
      nif: representante.nif,
      address: cliente.direccion,
      phoneNumber,
    };
  } else {
    clientData = { fullName: clientFullName, nif: cliente.nif, address: cliente.direccion, phoneNumber };
  }

  let companyData: MandateCompany;
  if (representante && representante.nif) {
    companyData = { fullName: clientFullName, nif: cliente.nif };
  } else {
    companyData = { fullName: '', nif: '' };
  }

  const actualDate = getCurrentSpanishDate();

  const fileData = {
    client: clientData,
    company: companyData,
    orderType: tipo,
    vehiclePlate: matricula,
    actualDate: actualDate,
  };

  return fileData;
}
