let twirlTimer: NodeJS.Timeout | null = null;

export function startTwirlTimer(phrase: string) {
    if (twirlTimer !== null) return;

    const P = ["\\", "|", "/", "-"];
    let x = 0;
    twirlTimer = setInterval(function () {
        process.stdout.write(`\r${P[x++]}  ${phrase}`);
        x &= 3;
    }, 250);
}

export function stopTwirlTimer() {
    if (twirlTimer === null) return;

    clearInterval(twirlTimer);
    twirlTimer = null;
    process.stdout.write("\r");
}
