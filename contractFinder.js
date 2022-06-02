import { buildServerList } from 'libHelpers.js';

/** @param {NS} ns */
export async function main(ns) {
    let lsResults = {};
    for (const hName of buildServerList(ns)) {
        if (!ns.getServer(hName).purchasedByPlayer) {
            let lsRes = ns.ls(hName, ".cct");
            if (lsRes.length > 0) {
                lsResults[hName] = lsRes;
            }
        }
    }
    // ns.tprint(lsResults);
    for (const hName in lsResults) { // key is the servername, so use in to grab key
        ns.tprintf("---------------------");
        ns.tprintf("%s: %s", hName, lsResults[hName]);
        ns.tprintf("---------------------");
        // ns.tprintf("---------------------");
        for (const fName of lsResults[hName]) {
            let cDescription = ns.codingcontract.getDescription(fName, hName);
            let cData = ns.codingcontract.getData(fName, hName);
            let cType = ns.codingcontract.getContractType(fName, hName);
            let cTriesRemaining = ns.codingcontract.getNumTriesRemaining(fName, hName);
            // ns.codingcontract.attempt() // attempts, probably never want to run from this script
            ns.tprintf("%s (%s Tries Remain)", cType, cTriesRemaining);
            ns.tprintf("%s", cDescription);
            ns.tprintf("%s", cData);
            ns.tprintf("_____________________");
            // ns.tprintf("---------------------");
        }
    }
}