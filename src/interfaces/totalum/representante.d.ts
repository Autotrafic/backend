interface TRepresentative {
  _id: string;
  nombre_o_razon_social: string;
  primer_apellido: string;
  segundo_apellido: string;
  nif: string;
  telefono: string;
  cliente: string;
}

interface TExtendedRepresentative extends TRepresentative {
  cliente: TClient;
}
