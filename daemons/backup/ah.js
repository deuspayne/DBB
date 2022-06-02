// import { buildServerList } from '/lib/helpers.js';
// HACKS 10% of total money. and that's it.
export function autocomplete(data, args) { return [...data.servers]; }
/** @param {NS} ns */
export async function main(ns) {
    let hackFile = "/hgw/h.js";
    let hostName = "Deus1048576";
    let percentToSteal = 10;
    percentToSteal /= 100;
    let sList = ns.args;
    for (const sName of sList) {
        let sObject = ns.getServer(sName);
        let moneyToHack = sObject.moneyAvailable;
        let mPercentPerHack = ns.hackAnalyze(sName);
        let numThreads = Math.round(percentToSteal / mPercentPerHack);
        while (false) { ns.sleep(5000); } // if not enough memory, wait until there is
        ns.tprintf(sName);
        ns.tprintf(`moneyToHack ===== ${moneyToHack}`);
        ns.tprintf(`mPercentPerHack = ${mPercentPerHack}`);
        ns.tprintf(`numThreads ====== ${numThreads}`);
        ns.tprintf(`ns.exec(${hackFile}, ${hostName}, ${numThreads}, ${sName});`);
        let pid = ns.exec(hackFile, hostName, numThreads, sName);
        ns.tail(pid);
    }
}