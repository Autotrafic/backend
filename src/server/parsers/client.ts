import Client from "../../database/models/Client/Client";
import ClientPrimitive from "../../database/models/Client/ClientPrimitive";

export default function parseClientFromPrimitive(client: ClientPrimitive): Client {
    return {
        // eslint-disable-next-line no-underscore-dangle
        _id: client._id,
        id: client.id,
        type: client.tipo,
        name: client.nombre_o_razon_social,
        firstSurname: client.primer_apellido,
        secondSurname: client.segundo_apellido,
        nif: client.nif,
        phoneNumber: client.telefono,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
    };
}
