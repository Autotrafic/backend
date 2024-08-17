export function roundToTwoDecimals(value: number): number {
    return parseFloat(value.toFixed(2));
}

export function getMonthNameInSpanish(): string {
    const date = new Date();
    return new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
}