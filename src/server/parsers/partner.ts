import Partner from '../../database/models/Partner/Partner';
import PrimitivePartner from '../../database/models/Partner/PrimitivePartner';

export default function parsePartnerFromPrimitive(partner: PrimitivePartner): Partner {
  return {
    client: partner.cliente,
    fullName: partner.nombre_completo,
    iae: partner.iae,
    transferenciaPrice: partner.precio_transferencia,
    informePrice: partner.precio_informe,
    notificacionPrice: partner.precio_notificacion,
    batecomPrice: partner.precio_batecom,
    id: partner.id,
    createdAt: partner.createdAt,
    updatedAt: partner.updatedAt,
  };
}
