export interface TCheck {
  shipmentId: string;
  reference: string;
  checks: Check[];
}

export interface Check {
  propertyChecked?: string;
  title: string;
  type: CheckType;
}

export enum CheckType {
  GOOD = 1,
  WARNING = 2,
  BAD = 3,
}

export type CheckCondition<T = string> = {
  check: (value: T) => boolean;
  checkInfo: Check;
};
