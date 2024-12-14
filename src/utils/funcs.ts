export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function roundToTwoDecimals(value: number): number {
  return parseFloat(value.toFixed(2));
}

export function getMonthNameInSpanish(): string {
  const date = new Date();
  return new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
}

export function getActualDay(): number {
  const today = new Date();
  return today.getDate();
}

export function getCurrentTrimesterDates() {
  const now = new Date();
  const currentMonth = now.getMonth();

  const startMonth = currentMonth < 3 ? 0 : currentMonth < 6 ? 3 : currentMonth < 9 ? 6 : 9;

  const start = new Date(now.getFullYear(), startMonth, 1);
  const end = new Date(now.getFullYear(), startMonth + 3, 0);

  return {
    start: start.toISOString(),
    end: new Date(end.setHours(23, 59, 59, 999)).toISOString(),
  };
}

export function getCurrentOrNextMonday(): number {
  const today = new Date();
  const dayOfWeek = today.getDay();

  if (dayOfWeek === 0) {
    today.setDate(today.getDate() + 1);
  } else if (dayOfWeek === 6) {
    today.setDate(today.getDate() + 2);
  }

  return today.setUTCHours(0, 0, 0, 0);
}

export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleanedObject: Partial<T> = {};

  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
      cleanedObject[key as keyof T] = obj[key];
    }
  });

  return cleanedObject;
}