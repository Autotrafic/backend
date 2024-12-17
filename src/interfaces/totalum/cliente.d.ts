interface TClient {
  _id: string;
  tipo: string;
  nombre_o_razon_social: string;
  primer_apellido: string;
  segundo_apellido: string;
  nif: string;
  telefono: string;
  email: string;
  direccion: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface TExtendedRelatedPerson extends TRelatedPerson {
  cliente: TExtendedClient;
}

interface TRelatedPerson {
  _id: string;
  nombre_o_razon_social: string;
  primer_apellido: string;
  segundo_apellido: string;
  telefono: string;
  cliente: string;
}

interface TRelatedPersonRelation {
  _id: string;
  cliente: {
    _id: string;
    telefono: string | null;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    id: string;
  };
  pedido: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  telefono: string | null;
  nombre_o_razon_social: string;
  primer_apellido: string;
  id: string;
}

interface TExtendedClient extends TClient {
  socio_profesional: TProfessionalPartner;
  representante: TRepresentative;
}

type TClientType = 'Particular' | 'Autónomo' | 'Empresa';
