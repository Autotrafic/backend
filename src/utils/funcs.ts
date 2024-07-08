export function roundToTwoDecimals(value: number): number {
    return parseFloat(value.toFixed(2));
}

export function createRedeableDate(currentDate: string) {
    const date = new Date(currentDate);
    
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };

    const formattedDate = date.toLocaleDateString('es-ES', options);

    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    
    return capitalizedDate;
}
