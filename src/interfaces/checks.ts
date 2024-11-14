export interface TCheck {
  shipmentId: string;
  reference: string;
  checks: Check[];
}

export interface Check {
  title: string;
  type: CheckType;
}

export enum CheckType {
  GOOD = 1,
  WARNING = 2,
  BAD = 3,
}
