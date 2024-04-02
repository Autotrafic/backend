interface OrderData {
    dataMatriculacion: string;
    comunidadAutonoma: string;
    valorVehiculo: number;
    potenciaFiscal: number;
    cilindrada: number;
    tipoVehiculo: string;
}

export function calculateItp(orderData: OrderData) {
    let deprecationValue;
    let prevItpValue;
    let ITP;

    // Función para convertir una cadena de fecha en un objeto Date
    function parseDate(dateStr: any) {
        const [day, month, year] = dateStr.split("/");
        return new Date(year, month - 1, day);
    }
    const matriculationDate = parseDate(orderData.dataMatriculacion) as any;
    const actualDate = new Date();
    const differenceMs = (actualDate as any) - matriculationDate;
    const differenceDays = differenceMs / (1000 * 60 * 60 * 24);

    const yearsDifference = differenceDays / 365;

    if (yearsDifference < 1) {
        deprecationValue = 100;
    } else if (yearsDifference >= 1 && yearsDifference < 2) {
        deprecationValue = 0.84;
    } else if (yearsDifference >= 2 && yearsDifference < 3) {
        deprecationValue = 0.67;
    } else if (yearsDifference >= 3 && yearsDifference < 4) {
        deprecationValue = 0.56;
    } else if (yearsDifference >= 4 && yearsDifference < 5) {
        deprecationValue = 0.47;
    } else if (yearsDifference >= 5 && yearsDifference < 6) {
        deprecationValue = 0.39;
    } else if (yearsDifference >= 6 && yearsDifference < 7) {
        deprecationValue = 0.34;
    } else if (yearsDifference >= 7 && yearsDifference < 8) {
        deprecationValue = 0.28;
    } else if (yearsDifference >= 8 && yearsDifference < 9) {
        deprecationValue = 0.24;
    } else if (yearsDifference >= 9 && yearsDifference < 10) {
        deprecationValue = 0.19;
    } else if (yearsDifference >= 10 && yearsDifference < 11) {
        deprecationValue = 0.17;
    } else if (yearsDifference >= 11 && yearsDifference < 12) {
        deprecationValue = 0.13;
    } else if (yearsDifference >= 12) {
        deprecationValue = 0.1;
    }

    const valorFiscal = orderData.valorVehiculo * deprecationValue;

    if (orderData.comunidadAutonoma === "AND") {
        if (orderData.potenciaFiscal > 15) {
            prevItpValue = 0.08;
        } else {
            prevItpValue = 0.04;
        }
    }

    if (orderData.comunidadAutonoma === "ARA") {
        if (orderData.tipoVehiculo === "turismo" && yearsDifference > 10) {
            if (orderData.cilindrada <= 1000) {
                prevItpValue = 0.04;
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
            }
        } else {
            prevItpValue = 0.04;
        }
    }

    if (orderData.comunidadAutonoma === "AST") {
        if (
            orderData.tipoVehiculo === "turismo" &&
            orderData.potenciaFiscal > 15
        ) {
            prevItpValue = 0.08;
        } else {
            prevItpValue = 0.04;
        }
    }

    if (orderData.comunidadAutonoma === "BAL") {
        if (
            orderData.tipoVehiculo === "turismo" &&
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
            }
        } else {
            prevItpValue = 0.055;
        }
    }

    if (orderData.comunidadAutonoma === "CANT") {
        if (orderData.tipoVehiculo === "turismo" && yearsDifference > 10) {
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
            orderData.tipoVehiculo === "turismo" &&
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
        if (orderData.tipoVehiculo === "turismo" && yearsDifference >= 15) {
            if (orderData.cilindrada < 1200) {
                prevItpValue = 22;
            } else if (
                orderData.cilindrada >= 1200 &&
                orderData.cilindrada <= 1599
            ) {
                prevItpValue = 38;
            }
        } else {
            prevItpValue = 0.03;
        }
    }

    if (orderData.comunidadAutonoma === "RIO") {
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

    if (orderData.comunidadAutonoma === "PBA") {
        prevItpValue = 0.04;
    }

    if (orderData.comunidadAutonoma === "VAL") {
        if (valorFiscal < 20000 && yearsDifference > 12) {
            if (
                orderData.tipoVehiculo === "turismo" &&
                orderData.cilindrada <= 1500
            ) {
                prevItpValue = 40;
            } else if (
                orderData.tipoVehiculo === "turismo" &&
                orderData.cilindrada > 1500 &&
                orderData.cilindrada <= 2000
            ) {
                prevItpValue = 60;
            } else if (
                orderData.tipoVehiculo === "turismo" &&
                orderData.cilindrada > 2000
            ) {
                prevItpValue = 140;
            } else if (
                (orderData.cilindrada <= 50 ||
                    orderData.tipoVehiculo === "moto") &&
                orderData.cilindrada <= 250
            ) {
                prevItpValue = 10;
            } else if (
                orderData.tipoVehiculo === "moto" &&
                orderData.cilindrada > 250 &&
                orderData.cilindrada <= 550
            ) {
                prevItpValue = 20;
            } else if (
                orderData.tipoVehiculo === "moto" &&
                orderData.cilindrada > 550 &&
                orderData.cilindrada <= 750
            ) {
                prevItpValue = 35;
            } else if (
                orderData.tipoVehiculo === "moto" &&
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
                orderData.tipoVehiculo === "turismo" &&
                orderData.cilindrada <= 1500
            ) {
                prevItpValue = 120;
            } else if (
                orderData.tipoVehiculo === "turismo" &&
                orderData.cilindrada > 1500 &&
                orderData.cilindrada <= 2000
            ) {
                prevItpValue = 180;
            } else if (
                orderData.tipoVehiculo === "turismo" &&
                orderData.cilindrada > 2000
            ) {
                prevItpValue = 280;
            } else if (
                (orderData.cilindrada <= 50 ||
                    orderData.tipoVehiculo === "moto") &&
                orderData.cilindrada <= 250
            ) {
                prevItpValue = 30;
            } else if (
                orderData.tipoVehiculo === "moto" &&
                orderData.cilindrada > 250 &&
                orderData.cilindrada <= 550
            ) {
                prevItpValue = 60;
            } else if (
                orderData.tipoVehiculo === "moto" &&
                orderData.cilindrada > 550 &&
                orderData.cilindrada <= 750
            ) {
                prevItpValue = 90;
            } else if (
                orderData.tipoVehiculo === "moto" &&
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

    if (prevItpValue > 1) {
        ITP = prevItpValue;
    } else {
        ITP = valorFiscal * prevItpValue;
    }

    console.log(ITP);

    return { ITP, valorFiscal, prevItpValue };
}

