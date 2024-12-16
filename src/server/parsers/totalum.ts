import { TExtendedOrder } from '../../interfaces/totalum/pedido';
import { getCurrentSpanishDate } from '../../utils/funcs';

export function parseTotalumOrderToMandateFileData(order: TExtendedOrder): MandateFileData {
  const { cliente, matricula, tipo } = order;
  const representante = cliente.representante;

  const clientFullName = `${cliente.nombre_o_razon_social} ${cliente.primer_apellido || ''} ${
    cliente.segundo_apellido || ''
  }`.trim();

  let clientData: { fullName: string; nif: string; address: string };
  if (representante && representante.nif) {
    clientData = { fullName: representante.nombre_o_razon_social, nif: representante.nif, address: cliente.direccion };
  } else {
    clientData = { fullName: clientFullName, nif: cliente.nif, address: cliente.direccion };
  }

  let companyData: { fullName: string; nif: string };
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
