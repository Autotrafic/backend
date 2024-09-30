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

type TClientType = 'Particular' | 'Autónomo' | 'Empresa';