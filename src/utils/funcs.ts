import { Check, TCheck } from '../interfaces/checks';

export function roundToTwoDecimals(value: number): number {
  return parseFloat(value.toFixed(2));
}

export function getMonthNameInSpanish(): string {
  const date = new Date();
  return new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
}

export function addCheckToList(list: TCheck[], reference: string, check: Check) {
  let updatedList = [...list];

  const checkToUpdate = updatedList.find((item) => item.reference === reference);

  if (checkToUpdate) {
    const checkExists = checkToUpdate.checks.some((existingCheck) => existingCheck.id === check.id);

    if (!checkExists) {
      checkToUpdate.checks.push(check);
    }
  } else {
    updatedList.push({
      reference: reference,
      checks: [check],
    });
  }

  return updatedList;
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