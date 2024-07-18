export default function parseDatetimeToSpanish(dateString: string): string {
    const date = new Date(dateString);

    const monthsSpanish = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
    ];

    const day = date.getUTCDate();
    const month = monthsSpanish[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${day} de ${month} de ${year}`;
}
