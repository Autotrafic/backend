export const mandateSignedByBuyerMessage =
  '✅ Hemos recibido correctamente la firma del mandato. Quedamos a la espera de la firma del vendedor para continuar con la transferencia';

export const mandateSignedBySellerMessage =
  '✅ Hemos recibido correctamente la firma del mandato. Quedamos a la espera de la firma del comprador para continuar con la transferencia';

export const mandatesSignedMessage =
  '✅ Hemos recibido correctamente la firma del comprador y vendedor. En cuanto tenga el provisional te lo adjunto por aquí';

export function getMandatesSignedMessageForCollaborator(vehiclePlate: string, driveUrl: string) {
  return `Ya están los mandatos firmados y subidos en la carpeta de Drive para la matrícula *${vehiclePlate}*:

${driveUrl}`;
}
