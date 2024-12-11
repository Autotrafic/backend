interface TProfessionalPartner {
  _id: string;
  nombre_completo: string;
  iae: number;
  precio_transferencia: number;
  precio_informe: number;
  precio_notificacion: number;
  precio_batecom: number;
  carpeta_google_drive: string;
  cliente: TClient;
  createdAt: string;
  updatedAt: string;
}

interface TExtendedProfessionalPartner extends TProfessionalPartner {
  cliente: TClient;
}
