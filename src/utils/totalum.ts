import { AutonomousCommunity } from '../interfaces/enums';

export const ovidiuPartnerData = {
  nombre_gestor: 'Ovidiu Sebastian Ilie',
  nif_gestor: 'X3879058Q',
  num_colegiado_gestor: 3966,
  nombre_colegio_gestor: 'Colegio Oficial de Gestores Administrativos de Cataluña',
  despacho_profesional: 'OVIDIU SEBASTIAN ILIE',
  domicilio_despacho_profesional: 'Vilanova i la Geltrú, calle Camí dels Tamarius nº 88 C.P.08800',
};

export function isOrderForCollaborator(autonomousCommunity: AutonomousCommunity): boolean {
  return (
    autonomousCommunity === AutonomousCommunity.Canarias ||
    autonomousCommunity === AutonomousCommunity.Murcia ||
    autonomousCommunity === AutonomousCommunity.Navarra ||
    autonomousCommunity === AutonomousCommunity.PaisVasco ||
    autonomousCommunity === AutonomousCommunity.LaRioja
  );
}

export function isClientAPartner(client: TExtendedClient): boolean {
  if (!client?._id) return false;

  return !!client?.socio_profesional;
}