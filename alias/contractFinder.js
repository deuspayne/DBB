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
    ns.tprint(lsResults);
}