import { TMandateIsFor } from '../../interfaces/enums';
import { DMandateIsFor } from '../../interfaces/import/totalum';
import { TExtendedClient } from '../../interfaces/totalum/cliente';
import { MandateClient, MandateCompany, MandateData } from '../../interfaces/totalum/other';
import { TExtendedOrder } from '../../interfaces/totalum/pedido';
import { getCurrentSpanishDate } from '../../utils/funcs';
import { isClientAPartner } from '../../utils/totalum';
import { ensureMandatePartner, validateRelatedPersons } from '../helpers/totalum';
import { parsePhoneNumberToE164 } from './other';

export function parseTotalumOrderToMandateFileData(order: TExtendedOrder, mandateIsFor: DMandateIsFor): MandateData[] {
  try {
    const { cliente, matricula, tipo, persona_relacionada: relatedPersons, gestoria_colaboradora } = order;

    const createMandateData = (sourceClient: TExtendedClient, clientType: TMandateIsFor): MandateData => {
      const { nombre_o_razon_social, primer_apellido, segundo_apellido, telefono, nif, direccion, representante } =
        sourceClient;

      const phoneNumber = parsePhoneNumberToE164(telefono);
      const clientFullName = `${nombre_o_razon_social} ${primer_apellido || ''} ${segundo_apellido || ''}`.trim();

      let clientData: MandateClient;
      if (representante && representante.length > 0) {
        const representativeFullName = `${representante[0].nombre_o_razon_social} ${
          representante[0].primer_apellido || ''
        } ${representante[0].segundo_apellido || ''}`.trim();

        clientData = {
          type: clientType,
          fullName: representativeFullName,
          nif: representante[0].nif,
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
      if (representante && representante.length > 0) {
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
        partner: ensureMandatePartner(gestoria_colaboradora),
      };
    };

    const result: MandateData[] = [];

    if (mandateIsFor.client && !isClientAPartner(cliente)) {
      result.push(createMandateData(cliente, TMandateIsFor.Client));
    }

    if (mandateIsFor.relatedPerson) {
      validateRelatedPersons(relatedPersons);

      for (let relatedPerson of relatedPersons) {
        if (!isClientAPartner(relatedPerson.cliente))
          result.push(createMandateData(relatedPerson.cliente, TMandateIsFor.RelatedPerson));
      }
    }

    return result;
  } catch (error) {
    throw new Error(`Error parseando los datos del pedido para obtener los datos del mandato: ${error.message}`);
  }
}
