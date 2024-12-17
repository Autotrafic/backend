import { TAutonomousCommunity } from './totalum/pedido';

export enum Fuel {
  GASOLINA = 'G',
  DIESEL = 'D',
  GASOLINA_GLP = 'S',
  ETANOL_CON_GASOLINA_O_BIO = 'M',
  ELECTRICO = 'Elc',
  HIDROGENO = 'H',
  HIBRIDO_GASOLINA_ELECTRICO = 'GyE',
  HIBRIDO_DIESEL_ELECTRICO = 'DyE',
}

export enum MotorbikeCCRange {
  FROM_0_TO_50_CC = 'Hasta 50 c.c.',
  FROM_51_TO_75_CC = 'Entre 50,01 y 75 c.c.',
  FROM_76_TO_125_CC = 'Entre 75,01 y 125 c.c.',
  FROM_126_TO_150_CC = 'Entre 125,01 y 150 c.c.',
  FROM_151_TO_200_CC = 'Entre 150,01 y 200 c.c.',
  FROM_201_TO_250_CC = 'Entre 200,01 y 250 c.c.',
  FROM_251_TO_350_CC = 'Entre 250,01 y 350 c.c.',
  FROM_351_TO_450_CC = 'Entre 350,01 y 450 c.c.',
  FROM_451_TO_550_CC = 'Entre 450,01 y 550 c.c.',
  FROM_551_TO_750_CC = 'Entre 550,01 y 750 c.c.',
  FROM_751_TO_1000_CC = 'Entre 750,01 y 1.000 c.c.',
  FROM_1001_TO_1200_CC = 'Entre 1.000,01 y 1.200 c.c.',
  FROM_1201_TO_INFINITE_CC = 'Entre 1.200,01 c.c. y superior cilindrada',
}

export enum ElectricPowerRange {
  FROM_0_TO_2_KW = 'Hasta 2 kW (2,71 cv)',
  FROM_2_01_TO_4_KW = 'De 2,01 kW (2,71 cv) a 4 kW (5,4 cv)',
  FROM_4_01_TO_6_KW = 'De 4,01 kW (5,41 cv) a 6 kW (8,2 cv)',
  FROM_6_01_TO_9_KW = 'De 6,01 kW (8,20 cv) a 9 kW (12 cv)',
  FROM_9_01_TO_12_KW = 'De 9,01 kW (12,01 cv) a 12 kW (16 cv)',
  FROM_12_01_TO_15_KW = 'De 12,01 kW (16,01 cv) a 15 kW (20 cv)',
  FROM_15_01_TO_20_KW = 'De 15,01 kW (20,01 cv) a 20 kW (27 cv)',
  FROM_20_01_TO_25_KW = 'De 20,01 kW (27,01 cv) a 25 kW (34 cv)',
  FROM_25_01_TO_30_KW = 'De 25,01 kW (34,01 cv) a 30 kW (41 cv)',
  FROM_30_01_TO_40_KW = 'De 30,01 kW (41,01 cv) a 40 kW (54 cv)',
  FROM_40_01_TO_55_KW = 'De 40,01 kW (54,01 cv) a 55 kW (75 cv)',
  FROM_55_01_TO_75_KW = 'De 55,01 kW (75,01 cv) a 75 kW (102 cv)',
  FROM_75_01_TO_90_KW = 'De 75,01 kW (102,01 cv) a 90 kW (122 cv)',
  FROM_90_01_TO_INFINITE = 'De 90,01 kW (122,01 cv) y superior potencia',
}

export enum AutonomousCommunityValue {
  ANDALUCIA = 'AND',
  ARAGON = 'ARA',
  ASTURIAS = 'AST',
  CANARIAS = 'CANA',
  CANTABRIA = 'CANT',
  CASTILLA_LA_MANCHA = 'CASM',
  CASTILLA_LEON = 'CASL',
  CATALUNA = 'CAT',
  EXTREMADURA = 'EXT',
  GALICIA = 'GAL',
  ISLAS_BALEARES = 'BAL',
  LA_RIOJA = 'RIO',
  MADRID = 'MAD',
  MURCIA = 'MUR',
  NAVARRA = 'NAV',
  PAIS_VASCO = 'PVA',
  VALENCIA = 'VAL',
}

export const autonomousCommunityMap: Record<AutonomousCommunityValue, TAutonomousCommunity> = {
  [AutonomousCommunityValue.ANDALUCIA]: 'Andalucía',
  [AutonomousCommunityValue.ARAGON]: 'Aragón',
  [AutonomousCommunityValue.ASTURIAS]: 'Asturias',
  [AutonomousCommunityValue.CANARIAS]: 'Canarias',
  [AutonomousCommunityValue.CANTABRIA]: 'Cantabria',
  [AutonomousCommunityValue.CASTILLA_LA_MANCHA]: 'Castilla la Mancha',
  [AutonomousCommunityValue.CASTILLA_LEON]: 'Castilla y León',
  [AutonomousCommunityValue.CATALUNA]: 'Cataluña',
  [AutonomousCommunityValue.EXTREMADURA]: 'Extremadura',
  [AutonomousCommunityValue.GALICIA]: 'Galicia',
  [AutonomousCommunityValue.ISLAS_BALEARES]: 'Baleares',
  [AutonomousCommunityValue.LA_RIOJA]: 'La Rioja',
  [AutonomousCommunityValue.MADRID]: 'Madrid',
  [AutonomousCommunityValue.MURCIA]: 'Murcia',
  [AutonomousCommunityValue.NAVARRA]: 'Navarra',
  [AutonomousCommunityValue.PAIS_VASCO]: 'País Vasco',
  [AutonomousCommunityValue.VALENCIA]: 'Valencia',
};

export enum AutonomousCommunity {
  Andalucia = 'Andalucía',
  Aragon = 'Aragón',
  Asturias = 'Asturias',
  Canarias = 'Canarias',
  Cantabria = 'Cantabria',
  CastillaLaMancha = 'Castilla la Mancha',
  CastillaLeon = 'Castilla y León',
  Cataluna = 'Cataluña',
  Extremadura = 'Extremadura',
  Galicia = 'Galicia',
  IslasBaleares = 'Baleares',
  LaRioja = 'La Rioja',
  Madrid = 'Madrid',
  Murcia = 'Murcia',
  Navarra = 'Navarra',
  PaisVasco = 'País Vasco',
  Valencia = 'Valencia',
}

export enum TOrderState {
  PendienteTramitarA9 = 'Pendiente Tramitar A9',
  PendienteEntregaTrafic = 'Pendiente Entrega Tráfico',
  EnTrafic = 'En Tráfico',
  PendienteEnvioCliente = 'Pendiente Envío Cliente',
  Rechazado = 'Rechazado',
  EnviadoCliente = 'Enviado Cliente',
  EntregadoCliente = 'Entregado Cliente',
  PendienteRecibirPermisoGestoria = 'Pendiente Recibir Permiso Gestoría',
  PendientePagoITP = 'Pendiente Pago ITP',
  PendienteEnviar3Gestoria = 'Pendiente enviar 3º gestoría',
  Enviado3Gestoria = 'Enviado 3º gestoría',
  PendienteRecibirInfoCliente = 'Pendiente recibir info cliente',
  NuevoPedidoWeb = 'Nuevo pedido web',
  PendienteDevolucionCorreos = 'Pendiente devolución Correos',
  PendienteEntregarCorreos = 'Pendiente entrega Correos',
  PendientePagoDevolucionEnvio = 'Pendiente Pago Devolución Envío',
  PendientePagoTramite = 'Pendiente Pago Trámite',
}

export enum TOrderType {
  Transferencia = 'Transferencia',
  DuplicadoPermiso = 'Duplicado permiso',
  Distintivo = 'Distintivo',
  Notificacion = 'Notificacion',
  EntregaCompraventa = 'Entrega compraventa',
  TransferenciaPorFinalizacionEntrega = 'Transferencia por finalizacion entrega',
  AltaPorBajaVoluntaria = 'Alta por baja voluntaria',
  CambioDeDomicilio = 'Cambio de domicilio',
  BajaTemporal = 'Baja temporal',
}

export enum THeaderType {
  Default = 1,
  Shipment = 2,
}

export enum TTaskState {
  Completed = 'Completada',
  InProcess = 'En proceso',
  Pending = 'Pendiente',
  WaitingClient = 'En espera cliente',
  PendingToCommunicateClient = 'Pendiente comunicar cliente',
}

export enum TAccountingBusiness {
  AutoTrafic = 'AutoTrafic',
  TransfiereYa = 'TransfiereYa',
}

export enum TAccountingType {
  PedidoAds = 'Pedido Ads',
  ConsultaWeb = 'Consulta Web',
  ContactoWhatsapp = 'Contacto WhatsApp',
}

export enum TOrderMandate {
  NoEnviados = 'No enviados',
  Enviados = 'Enviados',
  Firmados = 'Firmados',
  Adjuntados = 'Adjuntados',
}

export enum DocusealFormWebhookEventType {
  Viewed = 'form.viewed',
  Started = 'form.started',
  Completed = 'form.completed',
  Declined = 'form.declined',
}

export enum DocusealSubmissionStatus {
  Sent = 'sent',
  Awaiting = 'awaiting',
  Pending = 'pending',
  Completed = 'completed'
}

export const reverseAutonomousCommunityMap: Record<TAutonomousCommunity, AutonomousCommunityValue> = {
  Andalucía: AutonomousCommunityValue.ANDALUCIA,
  Aragón: AutonomousCommunityValue.ARAGON,
  Asturias: AutonomousCommunityValue.ASTURIAS,
  Canarias: AutonomousCommunityValue.CANARIAS,
  Cantabria: AutonomousCommunityValue.CANTABRIA,
  'Castilla la Mancha': AutonomousCommunityValue.CASTILLA_LA_MANCHA,
  'Castilla y León': AutonomousCommunityValue.CASTILLA_LEON,
  Cataluña: AutonomousCommunityValue.CATALUNA,
  Extremadura: AutonomousCommunityValue.EXTREMADURA,
  Galicia: AutonomousCommunityValue.GALICIA,
  Baleares: AutonomousCommunityValue.ISLAS_BALEARES,
  'La Rioja': AutonomousCommunityValue.LA_RIOJA,
  Madrid: AutonomousCommunityValue.MADRID,
  Murcia: AutonomousCommunityValue.MURCIA,
  Navarra: AutonomousCommunityValue.NAVARRA,
  'País Vasco': AutonomousCommunityValue.PAIS_VASCO,
  Valencia: AutonomousCommunityValue.VALENCIA,
};

export const SENDCLOUD_SHIP_STATUSES = {
  NOT_SORTED: { id: 6, message: 'Not sorted' },
  ERROR_COLLECTING: { id: 15, message: 'Error collecting' },
  PARCEL_CANCELLATION_FAILED: { id: 94, message: 'Parcel cancellation failed.' },
  CANCELLATION_REQUESTED: { id: 1999, message: 'Cancellation requested' },
  EXCEPTION: { id: 62996, message: 'Exception' },
  AT_CUSTOMS: { id: 62989, message: 'At Customs' },
  DELIVERY_METHOD_CHANGED: { id: 62993, message: 'Delivery method changed' },
  AT_SORTING_CENTRE: { id: 62990, message: 'At sorting centre' },
  CANCELLED_UPSTREAM: { id: 1998, message: 'Cancelled upstream' },
  ANNOUNCEMENT_FAILED: { id: 1002, message: 'Announcement failed' },
  REFUSED_BY_RECIPIENT: { id: 62991, message: 'Refused by recipient' },
  RETURNED_TO_SENDER: { id: 62992, message: 'Returned to sender' },
  DELIVERY_ADDRESS_CHANGED: { id: 62995, message: 'Delivery address changed' },
  SUBMITTING_CANCELLATION_REQUEST: { id: 2001, message: 'Submitting cancellation request' },
  DRIVER_EN_ROUTE: { id: 92, message: 'Driver en route' },
  DELIVERY_DATE_CHANGED: { id: 62994, message: 'Delivery date changed' },
  ADDRESS_INVALID: { id: 62997, message: 'Address invalid' },
  AWAITING_CUSTOMER_PICKUP: { id: 12, message: 'Awaiting customer pickup' },
  DELIVERED: { id: 11, message: 'Delivered' },
  SHIPMENT_COLLECTED_BY_CUSTOMER: { id: 93, message: 'Shipment collected by customer' },
  PARCEL_EN_ROUTE: { id: 91, message: 'Parcel en route' },
  UNABLE_TO_DELIVER: { id: 80, message: 'Unable to deliver' },
  SHIPMENT_PICKED_UP_BY_DRIVER: { id: 22, message: 'Shipment picked up by driver' },
  ANNOUNCED_NOT_COLLECTED: { id: 13, message: 'Announced: not collected' },
  DELIVERY_ATTEMPT_FAILED: { id: 8, message: 'Delivery attempt failed' },
  BEING_SORTED: { id: 7, message: 'Being sorted' },
  SORTED: { id: 5, message: 'Sorted' },
  DELIVERY_DELAYED: { id: 4, message: 'Delivery delayed' },
  EN_ROUTE_TO_SORTING_CENTER: { id: 3, message: 'En route to sorting center' },
  ANNOUNCED: { id: 1, message: 'Announced' },
  UNKNOWN_STATUS: { id: 1337, message: 'Unknown status - check carrier track & trace page for more insights' },
  NO_LABEL: { id: 999, message: 'No label' },
  BEING_ANNOUNCED: { id: 1001, message: 'Being announced' },
  CANCELLED: { id: 2000, message: 'Cancelled' },
  READY_TO_SEND: { id: 1000, message: 'Ready to send' },
};
