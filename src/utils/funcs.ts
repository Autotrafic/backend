export default function roundToTwoDecimals(value: number): number {
    return parseFloat(value.toFixed(2));
}