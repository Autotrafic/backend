interface TRepresentative {
  nombre_o_razon_social: string;
  primer_apellido: string;
  segundo_apellido: string;
  nif: string;
  telefono: string;
}

interface TExtendedRepresentative extends TRepresentative {
  cliente: TClient;
}
