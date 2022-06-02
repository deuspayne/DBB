// TODO in progress, needs a lot of work still
import { buildServerList } from 'libHelpers.js';

export function autocomplete(data, _) { return [...data.servers]; }

/** @param {NS} ns */
export async function main(ns) {
    // ns.tail();
    let growName = "/hgw/gs.js";
    let weakName = "/hgw/ws.js";
    let hackName = "/hgw/hs.js";
    let hPct = .05;
    let hostName = "Deus262144"; // TODO automatically grab host somehow
    let minDifficulty = .1;
    let defaultWeakenVal = .05;
    let sleepSec = 2;
    let sleepPadding = 200;
    do {
        let sList = (ns.args.length > 0) ? ns.args : buildServerList(ns); // get all servers
        for (const sName of sList) {
            // ns.tprintf(`sName = ${sName}`);
            let sObject = ns.getServer(sName);
            if (sObject.hasAdminRights && !sObject.purchasedByPlayer && sObject.moneyMax > 0) { // checks to see if it's hackable
                let difficultyPercent = (sObject.hackDifficulty - sObject.minDifficulty) / sObject.minDifficulty;
                // TODO new logic: do growth and weaken if either money or difficulty is very low
                //    else: full hack/grow/weaken bomb
                if (difficultyPercent > minDifficulty) { // if server needs weakening, bomb it with a big weaken
                    // let wBombThreads = difficultyPercent / defaultWeakenVal;
                    let wBombThreads = (sObject.hackDifficulty - sObject.minDifficulty) / defaultWeakenVal;
                    // ns.tprintf(`ns.exec(${weakName}, ${hostName}, ${wBombThreads}, ...[0, ${sName}]);`);
                    let wBombPid = ns.exec(weakName, hostName, wBombThreads, ...[0, sName]); // runs the tiny file threaded as much as possible
                    // ns.tail(wBombPid);
                } else { // TODO put in check to see if needs big money bomb before standard hack bomb
                    // let moneyToGrow = sObject.moneyMax - sObject.moneyAvailable;
                    let moneyExpected = ns.hackAnalyze(sName);
                    let hackThreads = Math.max(1, Math.floor(hPct * sObject.moneyMax / moneyExpected))
                        // let growthAmmount = 1 + ((sObject.moneyMax - sObject.moneyAvailable) / sObject.moneyAvailable); // old calc for grow bomb
                    let growthAmmount = 1 + hPct;
                    let growThreads = Math.max(1, Math.floor(ns.growthAnalyze(sName, growthAmmount)));
                    // TODO weakThreads is too big i think. debug
                    let weakThreads = Math.max(1, (Math.floor(ns.hackAnalyzeSecurity(hackThreads)) + Math.floor(ns.growthAnalyzeSecurity(growThreads)) / defaultWeakenVal));
                    let gTime = ns.getGrowTime(sName);
                    let wTime = ns.getWeakenTime(sName);
                    let hTime = ns.getHackTime(sName);
                    let gwTimeDiff = Math.floor(wTime - gTime);
                    let hwTimeDiff = Math.floor(wTime - hTime);

                    // ns.tprintf(sName);
                    // ns.tprintf(`growthAmmount = ${growthAmmount}`);
                    // ns.tprintf(`growThreads === ${growThreads}`);
                    // ns.tprintf(`weakThreads === ${weakThreads}`);
                    // ns.tprintf(`gTime ========= ${ns.tFormat(gTime)}`);
                    // ns.tprintf(`wTime ========= ${ns.tFormat(wTime)}`);
                    // ns.tprintf(`gwTimeDiff ==== ${gwTimeDiff}`);
                    // ns.tprintf(`ns.exec(${growName}, ${hostName}, ${growThreads}, ...[${gwTimeDiff - sleepPadding}, ${sName}]);`);
                    // ns.tprintf(`ns.exec(${weakName}, ${hostName}, ${weakThreads}, ...[0, ${sName}]);`);

                    // TODO if not enough RAM, wait until there is
                    while (false) { ns.sleep(5000); }
                    let hPid = ns.exec(hackName, hostName, hackThreads, ...[hwTimeDiff - sleepPadding, sName]); // runs the tiny file threaded as much as possible
                    let gPid = ns.exec(growName, hostName, growThreads, ...[gwTimeDiff - sleepPadding, sName]); // runs the tiny file threaded as much as possible
                    let wPid = ns.exec(weakName, hostName, weakThreads, ...[0, sName]); // runs the tiny file threaded as much as possible
                    // ns.tail(gPid);
                    // ns.tail(wPid);
                }
            }
        }
        await ns.sleep(sleepSec * 1000);
    } while (false) // set to false to run once
}