import { VEHICLE_TYPE } from "./constants";

interface OrderData {
    fechaMatriculacion: string;
    comunidadAutonoma: string;
    valorVehiculo: number;
    potenciaFiscal: number;
    cilindrada: number;
    tipoVehiculo: number;
    precioVenta: number;
}

export function calculateItp(orderData: OrderData) {
    if (orderData.tipoVehiculo === VEHICLE_TYPE.MOTORBIKE)
        orderData.potenciaFiscal = 0;
    if (orderData.tipoVehiculo === VEHICLE_TYPE.CARAVAN) {
        orderData.valorVehiculo = 0;
        orderData.cilindrada = 0;
    }

    console.log(orderData);

    let valorDepreciacion;
    let valorVehiculoMoto;
    let valorFiscal;
    let prevItpValue;
    let ITP;

    // Función para convertir una cadena de fecha en un objeto Date
    function parseDate(dateStr: any) {
        const [day, month, year] = dateStr.split("/");
        return new Date(year, month - 1, day);
    }
    const matriculationDate = parseDate(orderData.fechaMatriculacion) as any;
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

    if (orderData.tipoVehiculo === VEHICLE_TYPE.MOTORBIKE) {
        if (orderData.cilindrada <= 50) {
            valorVehiculoMoto = 750;
        } else if (orderData.cilindrada > 50 && orderData.cilindrada <= 75) {
            valorVehiculoMoto = 950;
        } else if (orderData.cilindrada > 75 && orderData.cilindrada <= 125) {
            valorVehiculoMoto = 1400;
        } else if (orderData.cilindrada > 125 && orderData.cilindrada <= 150) {
            valorVehiculoMoto = 1500;
        } else if (orderData.cilindrada > 150 && orderData.cilindrada <= 200) {
            valorVehiculoMoto = 1650;
        } else if (orderData.cilindrada > 200 && orderData.cilindrada <= 250) {
            valorVehiculoMoto = 1900;
        } else if (orderData.cilindrada > 250 && orderData.cilindrada <= 350) {
            valorVehiculoMoto = 2750;
        } else if (orderData.cilindrada > 350 && orderData.cilindrada <= 450) {
            valorVehiculoMoto = 3400;
        } else if (orderData.cilindrada > 450 && orderData.cilindrada <= 550) {
            valorVehiculoMoto = 3750;
        } else if (orderData.cilindrada > 550 && orderData.cilindrada <= 750) {
            valorVehiculoMoto = 6200;
        } else if (orderData.cilindrada > 750 && orderData.cilindrada <= 1000) {
            valorVehiculoMoto = 9300;
        } else if (
            orderData.cilindrada > 1000 &&
            orderData.cilindrada <= 1200
        ) {
            valorVehiculoMoto = 11800;
        } else if (orderData.cilindrada > 1200) {
            valorVehiculoMoto = 14900;
        }
    }

    if (orderData.tipoVehiculo === VEHICLE_TYPE.CAR)
        valorFiscal = orderData.valorVehiculo * valorDepreciacion;

    if (orderData.tipoVehiculo === VEHICLE_TYPE.MOTORBIKE)
        valorFiscal = valorVehiculoMoto * valorDepreciacion;

    if (orderData.comunidadAutonoma === "AND") {
        if (orderData.potenciaFiscal > 15) {
            prevItpValue = 0.08;
        } else {
            prevItpValue = 0.04;
        }
    }

    if (orderData.comunidadAutonoma === "ARA") {
        if (
            orderData.tipoVehiculo === VEHICLE_TYPE.CAR &&
            yearsDifference > 10
        ) {
            if (orderData.cilindrada <= 1000) {
                prevItpValue = 0;
            } else if (
                orderData.cilindrada > 1000 &&
                orderData.cilindrada <= 1500
            ) {
                prevItpValue = 20;
            } else if (
                orderData.cilindrada > 1500 &&
                orderData.cilindrada <= 2000
            ) {
                prevItpValue = 30;
            } else {
                prevItpValue = 0.04;
            }
        } else {
            prevItpValue = 0.04;
        }
    }

    if (orderData.comunidadAutonoma === "AST") {
        if (
            orderData.tipoVehiculo === VEHICLE_TYPE.CAR &&
            orderData.potenciaFiscal > 15
        ) {
            prevItpValue = 0.08;
        } else {
            prevItpValue = 0.04;
        }
    }

    if (orderData.comunidadAutonoma === "BAL") {
        if (
            orderData.tipoVehiculo === VEHICLE_TYPE.CAR &&
            orderData.potenciaFiscal > 15
        ) {
            prevItpValue = 0.08;
        } else {
            prevItpValue = 0.04;
        }
    }

    if (orderData.comunidadAutonoma === "CANA") {
        if (yearsDifference > 10) {
            if (orderData.cilindrada <= 1000) {
                prevItpValue = 40;
            } else if (
                orderData.cilindrada > 1000 &&
                orderData.cilindrada <= 1500
            ) {
                prevItpValue = 70;
            } else if (
                orderData.cilindrada > 1500 &&
                orderData.cilindrada <= 2000
            ) {
                prevItpValue = 115;
            } else {
                prevItpValue = 0.055;
            }
        } else {
            prevItpValue = 0.055;
        }
    }

    if (orderData.comunidadAutonoma === "CANT") {
        if (
            orderData.tipoVehiculo === VEHICLE_TYPE.CAR &&
            yearsDifference > 10
        ) {
            if (orderData.cilindrada < 1000) {
                prevItpValue = 55;
            } else if (
                orderData.cilindrada >= 1000 &&
                orderData.cilindrada < 1500
            ) {
                prevItpValue = 75;
            } else if (
                orderData.cilindrada >= 1500 &&
                orderData.cilindrada < 2000
            ) {
                prevItpValue = 115;
            } else {
                prevItpValue = 0.08;
            }
        } else {
            prevItpValue = 0.08;
        }
    }

    if (orderData.comunidadAutonoma === "CASM") {
        prevItpValue = 0.06;
    }

    if (orderData.comunidadAutonoma === "CASL") {
        if (
            orderData.tipoVehiculo === VEHICLE_TYPE.CAR &&
            orderData.potenciaFiscal > 15
        ) {
            prevItpValue = 0.08;
        } else {
            prevItpValue = 0.05;
        }
    }

    if (orderData.comunidadAutonoma === "CAT") {
        if (orderData.cilindrada <= 50) {
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

    if (orderData.comunidadAutonoma === "EXT") {
        prevItpValue = 0.06;
    }

    if (orderData.comunidadAutonoma === "GAL") {
        if (
            orderData.tipoVehiculo === VEHICLE_TYPE.CAR &&
            yearsDifference >= 15
        ) {
            if (orderData.cilindrada < 1200) {
                prevItpValue = 22;
            } else if (
                orderData.cilindrada >= 1200 &&
                orderData.cilindrada <= 1599
            ) {
                prevItpValue = 38;
            } else if (orderData.cilindrada >= 1600) {
                prevItpValue = 0.03;
            }
        } else {
            prevItpValue = 0.03;
        }
    }

    if (orderData.comunidadAutonoma === "MAD") {
        prevItpValue = 0.04;
    }

    if (orderData.comunidadAutonoma === "RIO") {
        prevItpValue = 0.04;
    }

    if (orderData.comunidadAutonoma === "NAV") {
        if (orderData.cilindrada <= 50) {
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

    if (orderData.comunidadAutonoma === "PVA") {
        prevItpValue = 0.04;
    }

    if (orderData.comunidadAutonoma === "VAL") {
        if (valorFiscal < 20000 && yearsDifference > 12) {
            if (
                orderData.tipoVehiculo === VEHICLE_TYPE.CAR &&
                orderData.cilindrada <= 1500
            ) {
                prevItpValue = 40;
            } else if (
                orderData.tipoVehiculo === VEHICLE_TYPE.CAR &&
                orderData.cilindrada > 1500 &&
                orderData.cilindrada <= 2000
            ) {
                prevItpValue = 60;
            } else if (
                orderData.tipoVehiculo === VEHICLE_TYPE.CAR &&
                orderData.cilindrada > 2000
            ) {
                prevItpValue = 140;
            } else if (
                (orderData.cilindrada <= 50 ||
                    orderData.tipoVehiculo === VEHICLE_TYPE.MOTORBIKE) &&
                orderData.cilindrada <= 250
            ) {
                prevItpValue = 10;
            } else if (
                orderData.tipoVehiculo === VEHICLE_TYPE.MOTORBIKE &&
                orderData.cilindrada > 250 &&
                orderData.cilindrada <= 550
            ) {
                prevItpValue = 20;
            } else if (
                orderData.tipoVehiculo === VEHICLE_TYPE.MOTORBIKE &&
                orderData.cilindrada > 550 &&
                orderData.cilindrada <= 750
            ) {
                prevItpValue = 35;
            } else if (
                orderData.tipoVehiculo === VEHICLE_TYPE.MOTORBIKE &&
                orderData.cilindrada > 750
            ) {
                prevItpValue = 55;
            }
        } else if (
            valorFiscal < 20000 &&
            yearsDifference > 5 &&
            yearsDifference <= 12
        ) {
            if (
                orderData.tipoVehiculo === VEHICLE_TYPE.CAR &&
                orderData.cilindrada <= 1500
            ) {
                prevItpValue = 120;
            } else if (
                orderData.tipoVehiculo === VEHICLE_TYPE.CAR &&
                orderData.cilindrada > 1500 &&
                orderData.cilindrada <= 2000
            ) {
                prevItpValue = 180;
            } else if (
                orderData.tipoVehiculo === VEHICLE_TYPE.CAR &&
                orderData.cilindrada > 2000
            ) {
                prevItpValue = 280;
            } else if (
                (orderData.cilindrada <= 50 ||
                    orderData.tipoVehiculo === VEHICLE_TYPE.MOTORBIKE) &&
                orderData.cilindrada <= 250
            ) {
                prevItpValue = 30;
            } else if (
                orderData.tipoVehiculo === VEHICLE_TYPE.MOTORBIKE &&
                orderData.cilindrada > 250 &&
                orderData.cilindrada <= 550
            ) {
                prevItpValue = 60;
            } else if (
                orderData.tipoVehiculo === VEHICLE_TYPE.MOTORBIKE &&
                orderData.cilindrada > 550 &&
                orderData.cilindrada <= 750
            ) {
                prevItpValue = 90;
            } else if (
                orderData.tipoVehiculo === VEHICLE_TYPE.MOTORBIKE &&
                orderData.cilindrada > 750
            ) {
                prevItpValue = 140;
            }
        } else if (
            yearsDifference <= 5 &&
            (orderData.cilindrada > 2000 || valorFiscal >= 20000)
        ) {
            prevItpValue = 0.08;
        } else {
            prevItpValue = 0.06;
        }
        //Vehículos adquiridos al final de su vida útil para su valorización y eliminación: 2%
    }

    if (orderData.comunidadAutonoma === "MUR") {
        if (yearsDifference >= 12) {
            if (orderData.cilindrada <= 1000) {
                prevItpValue = 0;
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
    } else if (prevItpValue < 1 && orderData.precioVenta < valorFiscal) {
        ITP = valorFiscal * prevItpValue;
        console.log("Calculated with Valor Fiscal");
    } else ITP = orderData.precioVenta * prevItpValue;
    console.log("Calculated with Precio Venta");

    console.log(
        `Valor fiscal: ${valorFiscal}. Deprecicacion: ${valorDepreciacion}. Años dif.: ${yearsDifference}. Prev ITP value: ${prevItpValue}`
    );

    const comunidAutonoma = orderData.comunidadAutonoma;

    return {
        ITP,
        valorFiscal,
        prevItpValue,
        valorDepreciacion,
        comunidAutonoma,
    };
}

