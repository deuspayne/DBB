export function autocomplete(data, args) {
    return [...data.servers, "--verbose"]; // This script autocompletes the list of servers.
}
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    ns.tail();
    let argFlag = ns.flags([
        ['verbose', false]
    ]);
    let maxBars = 20;
    let hostName = argFlag._[0];

    while (true) {
        // let serverObject = ns.getServer(hostName);
        let ramUsed = ns.getServerUsedRam(hostName);
        let maxRam = ns.getServerMaxRam(hostName);
        ns.clearLog();
        let ramPct = ramUsed / maxRam;
        let numBars = Math.round(ramPct * maxBars);


        if (argFlag.verbose) {
            let sList = ns.ps(hostName);
            for (const sObj of sList) {
                let scriptRam = ns.getScriptRam(sObj.filename, hostName) * sObj.threads;
                let scriptRamPct = scriptRam / maxRam;
                let pidMaxBars = maxBars / 2;
                let scriptBars = Math.round(scriptRamPct * pidMaxBars);
                ns.printf(`[%s%s] %6s\t(%s)\t%s -t %s\t[%s]`,
                    '|'.repeat(scriptBars),
                    '-'.repeat(pidMaxBars - scriptBars),
                    ns.nFormat(scriptRamPct, "0,0.00%"),
                    sObj.pid,
                    sObj.filename,
                    sObj.threads,
                    sObj.args,
                );
            }
        }
        ns.printf(`\n(%s) %s\n[%s%s] %7s (%s of %s GB)`,
            new Date().toLocaleTimeString(),
            hostName,
            '|'.repeat(numBars),
            '-'.repeat(maxBars - numBars),
            ns.nFormat(ramPct, "0,0.00%"),
            ns.nFormat(ramUsed, "0,0.00"),
            ns.nFormat(maxRam, "0,0.00"),
        );

        await ns.sleep(1000);
    }
}