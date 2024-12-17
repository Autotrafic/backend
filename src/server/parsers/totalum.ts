import { DMandateIsFor } from '../../interfaces/import/totalum';
import { TExtendedOrder } from '../../interfaces/totalum/pedido';
import { getCurrentSpanishDate } from '../../utils/funcs';
import { validateRelatedPerson } from '../helpers/totalum';
import { parsePhoneNumberToE164 } from './other';

export function parseTotalumOrderToMandateFileData(order: TExtendedOrder, mandateIsFor: DMandateIsFor): MandateData[] {
  try {
    const { cliente, matricula, tipo, persona_relacionada: relatedPersons } = order;

    const createMandateData = (sourceClient: TExtendedClient, clientType: 'client' | 'related_person'): MandateData => {
      const { nombre_o_razon_social, primer_apellido, segundo_apellido, telefono, nif, direccion, representante } =
        sourceClient;

      const phoneNumber = parsePhoneNumberToE164(telefono);
      const clientFullName = `${nombre_o_razon_social} ${primer_apellido || ''} ${segundo_apellido || ''}`.trim();

      let clientData: MandateClient;
      if (representante && representante.nif) {
        clientData = {
          type: clientType,
          fullName: representante.nombre_o_razon_social,
          nif: representante.nif,
          address: direccion,
          phoneNumber,
        };
      } else {
        clientData = {
          type: clientType,
          fullName: clientFullName,
          nif: nif,
          address: direccion,
          phoneNumber,
        };
      }

      let companyData: MandateCompany;
      if (representante && representante.nif) {
        companyData = { fullName: clientFullName, nif: nif };
      } else {
        companyData = { fullName: '', nif: '' };
      }

      return {
        client: clientData,
        company: companyData,
        orderType: tipo,
        vehiclePlate: matricula,
        actualDate: getCurrentSpanishDate(),
      };
    };

    const result: MandateData[] = [];

    if (mandateIsFor.client) {
      result.push(createMandateData(cliente, 'client'));
    }

    if (mandateIsFor.relatedPerson) {
      const relatedPerson = validateRelatedPerson(relatedPersons);
      result.push(createMandateData(relatedPerson.cliente, 'related_person'));
    }

    return result;
  } catch (error) {
    throw new Error(`Error parseando los datos del pedido para obtener los datos del mandato: ${error.message}`);
  }
}