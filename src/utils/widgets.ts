let twirlTimer: NodeJS.Timeout | null = null;

export function startTwirlTimer(phrase: string) {
    if (twirlTimer !== null) return;

    const P = ["\\", "|", "/", "-"];
    let x = 0;
    twirlTimer = setInterval(function () {
        console.log(`${P[x++]} ${phrase}`);
        x &= 3;
    }, 250);
}

export function stopTwirlTimer() {
    if (twirlTimer === null) return;

    clearInterval(twirlTimer);
    twirlTimer = null;
    console.log("\n");
}
