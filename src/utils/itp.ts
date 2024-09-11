import { VEHICLE_TYPE } from "./constants";

interface OrderData {
    fechaMatriculacion: string;
    comunidadAutonoma: string;
    valorVehiculo: number;
    potenciaFiscal: number;
    cilindrada: number;
    tipoVehiculo: number;
    precioVenta?: number;
}

export default function calculateItp(orderData: OrderData) {
    const { fechaMatriculacion, comunidadAutonoma, tipoVehiculo } = orderData;
    let { valorVehiculo, potenciaFiscal, cilindrada, precioVenta } = orderData;

    precioVenta = 0;

    if (tipoVehiculo === VEHICLE_TYPE.MOTORBIKE) potenciaFiscal = 0;
    if (tipoVehiculo === VEHICLE_TYPE.CARAVAN) {
        valorVehiculo = 0;
        cilindrada = 0;
    }

    let valorDepreciacion;
    let valorVehiculoMoto;
    let valorFiscal;
    let prevItpValue;
    let ITP;

    function parseDate(dateStr: any) {
        const [day, month, year] = dateStr.split("/");
        return new Date(year, month - 1, day);
    }

    const matriculationDate = parseDate(fechaMatriculacion) as any;
    const actualDate = new Date();
    const differenceMs = (actualDate as any) - matriculationDate;
    const differenceDays = differenceMs / (1000 * 60 * 60 * 24);

    const yearsDifference = differenceDays / 365;

    if (yearsDifference < 1) {
        valorDepreciacion = 1;
    } else if (yearsDifference >= 1 && yearsDifference < 2) {
        valorDepreciacion = 0.84;
    } else if (yearsDifference >= 2 && yearsDifference < 3) {
        valorDepreciacion = 0.67;
    } else if (yearsDifference >= 3 && yearsDifference < 4) {
        valorDepreciacion = 0.56;
    } else if (yearsDifference >= 4 && yearsDifference < 5) {
        valorDepreciacion = 0.47;
    } else if (yearsDifference >= 5 && yearsDifference < 6) {
        valorDepreciacion = 0.39;
    } else if (yearsDifference >= 6 && yearsDifference < 7) {
        valorDepreciacion = 0.34;
    } else if (yearsDifference >= 7 && yearsDifference < 8) {
        valorDepreciacion = 0.28;
    } else if (yearsDifference >= 8 && yearsDifference < 9) {
        valorDepreciacion = 0.24;
    } else if (yearsDifference >= 9 && yearsDifference < 10) {
        valorDepreciacion = 0.19;
    } else if (yearsDifference >= 10 && yearsDifference < 11) {
        valorDepreciacion = 0.17;
    } else if (yearsDifference >= 11 && yearsDifference < 12) {
        valorDepreciacion = 0.13;
    } else if (yearsDifference >= 12) {
        valorDepreciacion = 0.1;
    }

    if (tipoVehiculo === VEHICLE_TYPE.MOTORBIKE) {
        if (cilindrada <= 50) {
            valorVehiculoMoto = 800;
        } else if (cilindrada > 50 && cilindrada <= 75) {
            valorVehiculoMoto = 100;
        } else if (cilindrada > 75 && cilindrada <= 125) {
            valorVehiculoMoto = 1400;
        } else if (cilindrada > 125 && cilindrada <= 150) {
            valorVehiculoMoto = 1500;
        } else if (cilindrada > 150 && cilindrada <= 200) {
            valorVehiculoMoto = 1700;
        } else if (cilindrada > 200 && cilindrada <= 250) {
            valorVehiculoMoto = 2000;
        } else if (cilindrada > 250 && cilindrada <= 350) {
            valorVehiculoMoto = 2800;
        } else if (cilindrada > 350 && cilindrada <= 450) {
            valorVehiculoMoto = 3500;
        } else if (cilindrada > 450 && cilindrada <= 550) {
            valorVehiculoMoto = 3900;
        } else if (cilindrada > 550 && cilindrada <= 750) {
            valorVehiculoMoto = 6400;
        } else if (cilindrada > 750 && cilindrada <= 1000) {
            valorVehiculoMoto = 9600;
        } else if (cilindrada > 1000 && cilindrada <= 1200) {
            valorVehiculoMoto = 12100;
        } else if (cilindrada > 1200) {
            valorVehiculoMoto = 15300;
        }
    }

    if (tipoVehiculo === VEHICLE_TYPE.CAR)
        valorFiscal = valorVehiculo * valorDepreciacion;

    if (tipoVehiculo === VEHICLE_TYPE.MOTORBIKE)
        valorFiscal = valorVehiculoMoto * valorDepreciacion;

    if (comunidadAutonoma === "AND") {
        if (potenciaFiscal > 15) {
            prevItpValue = 0.08;
        } else {
            prevItpValue = 0.04;
        }
    }

    if (comunidadAutonoma === "ARA") {
        if (yearsDifference > 10) {
            if (cilindrada <= 1000) {
                prevItpValue = 0;
            } else if (cilindrada > 1000 && cilindrada <= 1500) {
                prevItpValue = 20;
            } else if (cilindrada > 1500 && cilindrada <= 2000) {
                prevItpValue = 30;
            } else {
                prevItpValue = 0.04;
            }
        } else {
            prevItpValue = 0.04;
        }
    }

    if (comunidadAutonoma === "AST") {
        if (tipoVehiculo === VEHICLE_TYPE.CAR && potenciaFiscal > 15) {
            prevItpValue = 0.08;
        } else {
            prevItpValue = 0.04;
        }
    }

    if (comunidadAutonoma === "BAL") {
        if (tipoVehiculo === VEHICLE_TYPE.CAR && potenciaFiscal > 15) {
            prevItpValue = 0.08;
        } else {
            prevItpValue = 0.04;
        }
    }

    if (orderData.comunidadAutonoma === "CANA") {
        if (yearsDifference > 10) {
            if (orderData.cilindrada <= 1000) {
                prevItpValue = 40;
            } else if (cilindrada > 1000 && cilindrada <= 1500) {
                prevItpValue = 70;
            } else if (cilindrada > 1500 && cilindrada <= 2000) {
                prevItpValue = 115;
            } else {
                prevItpValue = 0.055;
            }
        } else {
            prevItpValue = 0.055;
        }
    }

    if (comunidadAutonoma === "CANT") {
        if (yearsDifference > 10) {
            if (cilindrada < 1000) {
                prevItpValue = 55;
            } else if (cilindrada >= 1000 && cilindrada < 1500) {
                prevItpValue = 75;
            } else if (cilindrada >= 1500 && cilindrada < 2000) {
                prevItpValue = 115;
            } else {
                prevItpValue = 0.08;
            }
        } else {
            prevItpValue = 0.08;
        }
    }

    if (comunidadAutonoma === "CASM") {
        prevItpValue = 0.06;
    }

    if (comunidadAutonoma === "CASL") {
        if (tipoVehiculo === VEHICLE_TYPE.CAR && potenciaFiscal > 15) {
            prevItpValue = 0.08;
        } else {
            prevItpValue = 0.05;
        }
    }

    if (comunidadAutonoma === "CAT") {
        if (cilindrada <= 50) {
            prevItpValue = 0;
        } else if (
            yearsDifference >= 10 &&
            yearsDifference < 30 &&
            valorFiscal < 40000
        ) {
            prevItpValue = 0;
        } else {
            prevItpValue = 0.05;
        }
    }

    if (comunidadAutonoma === "EXT") {
        prevItpValue = 0.06;
    }

    if (comunidadAutonoma === "GAL") {
        if (tipoVehiculo === VEHICLE_TYPE.CAR && yearsDifference >= 15) {
            if (cilindrada < 1200) {
                prevItpValue = 22;
            } else if (cilindrada >= 1200 && cilindrada <= 1599) {
                prevItpValue = 38;
            } else if (cilindrada >= 1600) {
                prevItpValue = 0.03;
            }
        } else {
            prevItpValue = 0.03;
        }
    }

    if (comunidadAutonoma === "MAD") {
        prevItpValue = 0.04;
    }

    if (orderData.comunidadAutonoma === "MUR") {
        if (yearsDifference >= 12) {
            if (orderData.cilindrada <= 1000) {
                prevItpValue = 0.04;
            } else if (
                orderData.cilindrada > 1000 &&
                orderData.cilindrada <= 1500
            ) {
                prevItpValue = 30;
            } else if (
                orderData.cilindrada > 1500 &&
                orderData.cilindrada <= 2000
            ) {
                prevItpValue = 50;
            } else {
                prevItpValue = 0.04;
            }
        } else {
            prevItpValue = 0.04;
        }
    }

    if (comunidadAutonoma === "RIO") {
        prevItpValue = 0.04;
    }

    if (comunidadAutonoma === "NAV") {
        if (cilindrada <= 50) {
            prevItpValue = 0;
        } else if (
            yearsDifference >= 10 &&
            yearsDifference < 30 &&
            valorFiscal < 40000
        ) {
            prevItpValue = 0;
        } else {
            prevItpValue = 0.04;
        }
    }

    if (comunidadAutonoma === "PVA") {
        prevItpValue = 0.04;
    }

    if (comunidadAutonoma === "VAL") {
        if (valorFiscal < 20000 && yearsDifference > 12) {
            if (tipoVehiculo === VEHICLE_TYPE.CAR && cilindrada <= 1500) {
                prevItpValue = 40;
            } else if (
                tipoVehiculo === VEHICLE_TYPE.CAR &&
                cilindrada > 1500 &&
                cilindrada <= 2000
            ) {
                prevItpValue = 60;
            } else if (tipoVehiculo === VEHICLE_TYPE.CAR && cilindrada > 2000) {
                prevItpValue = 140;
            } else if (
                (cilindrada <= 50 || tipoVehiculo === VEHICLE_TYPE.MOTORBIKE) &&
                cilindrada <= 250
            ) {
                prevItpValue = 10;
            } else if (
                tipoVehiculo === VEHICLE_TYPE.MOTORBIKE &&
                cilindrada > 250 &&
                cilindrada <= 550
            ) {
                prevItpValue = 20;
            } else if (
                tipoVehiculo === VEHICLE_TYPE.MOTORBIKE &&
                cilindrada > 550 &&
                cilindrada <= 750
            ) {
                prevItpValue = 35;
            } else if (
                tipoVehiculo === VEHICLE_TYPE.MOTORBIKE &&
                cilindrada > 750
            ) {
                prevItpValue = 55;
            }
        } else if (
            valorFiscal < 20000 &&
            yearsDifference > 5 &&
            yearsDifference <= 12
        ) {
            if (tipoVehiculo === VEHICLE_TYPE.CAR && cilindrada <= 1500) {
                prevItpValue = 120;
            } else if (
                tipoVehiculo === VEHICLE_TYPE.CAR &&
                cilindrada > 1500 &&
                cilindrada <= 2000
            ) {
                prevItpValue = 180;
            } else if (tipoVehiculo === VEHICLE_TYPE.CAR && cilindrada > 2000) {
                prevItpValue = 280;
            } else if (
                (cilindrada <= 50 || tipoVehiculo === VEHICLE_TYPE.MOTORBIKE) &&
                cilindrada <= 250
            ) {
                prevItpValue = 30;
            } else if (
                tipoVehiculo === VEHICLE_TYPE.MOTORBIKE &&
                cilindrada > 250 &&
                cilindrada <= 550
            ) {
                prevItpValue = 60;
            } else if (
                tipoVehiculo === VEHICLE_TYPE.MOTORBIKE &&
                cilindrada > 550 &&
                cilindrada <= 750
            ) {
                prevItpValue = 90;
            } else if (
                tipoVehiculo === VEHICLE_TYPE.MOTORBIKE &&
                cilindrada > 750
            ) {
                prevItpValue = 140;
            }
        } else if (
            yearsDifference <= 5 &&
            (cilindrada > 2000 || valorFiscal >= 20000)
        ) {
            prevItpValue = 0.08;
        } else {
            prevItpValue = 0.06;
        }
    }

    if (orderData.comunidadAutonoma === "MUR") {
        if (yearsDifference >= 12) {
            if (orderData.cilindrada <= 1000) {
                prevItpValue = 0.04;
            } else if (
                orderData.cilindrada > 1000 &&
                orderData.cilindrada <= 1500
            ) {
                prevItpValue = 30;
            } else if (
                orderData.cilindrada > 1500 &&
                orderData.cilindrada <= 2000
            ) {
                prevItpValue = 50;
            } else {
                prevItpValue = 0.04;
            }
        } else {
            prevItpValue = 0.04;
        }
    }

    if (prevItpValue > 1) {
        ITP = prevItpValue;
    } else if (prevItpValue < 1 && precioVenta < valorFiscal) {
        ITP = valorFiscal * prevItpValue;
    } else ITP = precioVenta * prevItpValue;

    const comunidAutonoma = comunidadAutonoma;

    return {
        ITP,
        valorFiscal,
        prevItpValue,
        valorDepreciacion,
        comunidAutonoma,
    };
}
