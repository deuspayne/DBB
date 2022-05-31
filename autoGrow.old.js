// TODO build better logic for how much to grow/weaken. don't need to ONLY weaken, but just prioritize how many threads go to it

import { buildServerList } from '/lib/helpers.js';

let confSchema = [
	['skip', false],
	['tLimit', 0],
	['hostName', "home"],
];
export function autocomplete(data, _) {
	let newArray = [];
	confSchema.forEach(element => {
		newArray.push(`--${element[0]}`);
	});
	return [...data.servers, ...newArray];
}
/** @param {NS} ns */
export async function main(ns) {
	let confFlags = ns.flags(confSchema);
	ns.disableLog("ALL");
	// ns.tail();
	let growName = "/hgw/gs.js";
	let weakName = "/hgw/ws.js";
	let hostName = confFlags.hostName;

	let minDifficulty = .01; // always weaken bomb
	let minMoneyPct = .99; // always grow bomb
	let defaultWeakenVal = .05;
	let sleepPadding = 500;
	do {
		let maxWait = 0;
		let sList = (confFlags['_'].length > 0) ? confFlags['_'] : buildServerList(ns); // get all servers
		let startTime = new Date();
		ns.print(`timestamp: ${startTime.toLocaleTimeString()}`); // time
		for (const sName of sList) {
			let sObject = ns.getServer(sName);
			if (sObject.hasAdminRights && !sObject.purchasedByPlayer && sObject.moneyMax > 0) { // checks to see if it's hackable
				let difficultyPercent = (sObject.hackDifficulty - sObject.minDifficulty) / sObject.minDifficulty;
				if (difficultyPercent > minDifficulty) { // if server needs weakening, bomb it with a big weaken
					let wBombThreads = Math.max(1, Math.ceil((sObject.hackDifficulty - sObject.minDifficulty) / defaultWeakenVal));
					if (confFlags.tLimit > 0) wBombThreads = Math.min(confFlags.tLimit, wBombThreads);
					let wTime = ns.getWeakenTime(sName);
					ns.print(`WARN: ${sName} is being weaken bombed! wThreads=${wBombThreads} wTime=${ns.tFormat(wTime)}`);
					maxWait = Math.max(maxWait, wTime);
					let wBombPid = (confFlags.skip) ? 0 : ns.exec(weakName, hostName, wBombThreads, ...[0, sName, new Date(startTime.getTime() + wTime).toLocaleTimeString()]); // runs the tiny file threaded as much as possible
					// ns.tail(wBombPid);
				} else if (sObject.moneyAvailable / sObject.moneyMax < minMoneyPct) {
					// let moneyToGrow = sObject.moneyMax - sObject.moneyAvailable;
					let growthAmmount = 1 + ((sObject.moneyMax - sObject.moneyAvailable) / Math.max(1, sObject.moneyAvailable));
					let growThreads = Math.max(1, Math.ceil(ns.growthAnalyze(sName, growthAmmount)));
					if (confFlags.tLimit > 0) growThreads = Math.min(confFlags.tLimit, growThreads);
					let weakThreads = Math.max(1, Math.ceil(ns.growthAnalyzeSecurity(growThreads) / defaultWeakenVal));
					if (confFlags.tLimit > 0) weakThreads = Math.min(confFlags.tLimit, weakThreads);
					let gTime = ns.getGrowTime(sName);
					let wTime = ns.getWeakenTime(sName);
					let gwTimeDiff = Math.ceil(wTime - gTime);
					maxWait = Math.max(maxWait, gTime, wTime);
					let eTime = new Date(startTime.getTime() + Math.max(wTime, gTime));


					ns.print(`INFO: ${sName} is being grow bombed! gThreads=${growThreads} wThreads=${weakThreads} wTime=${ns.tFormat(Math.max(gTime, wTime))}`);
					while (false) { ns.sleep(5000); } // TODO if not enough memory, wait until there is
					let gPid = (confFlags.skip) ? 0 : ns.exec(growName, hostName, growThreads, ...[gwTimeDiff - sleepPadding, sName, eTime.toLocaleTimeString()]); // runs the tiny file threaded as much as possible
					let wPid = (confFlags.skip) ? 0 : ns.exec(weakName, hostName, weakThreads, ...[0, sName, eTime.toLocaleTimeString()]); // runs the tiny file threaded as much as possible
					if (gPid == 0 || wPid == 0) {
						ns.print(`ERROR: not enough memory to launch package, aborting grow/weaken. only waiting 10 seconds`);
						maxWait = 9000; // buffer at the end
						if (gPid != 0) ns.kill(gPid);
						if (wPid != 0) ns.kill(wPid);
					}
				} else {
					// TODO Does anything need to be done here?
					// ns.tprint(`${sName} doesn't need money or security bomb`);
				}
			}
		}
		maxWait += 1000;
		// ns.print(`maxWait found to be ${ns.tFormat(maxWait)}`)
		let endTime = new Date(startTime.getTime() + maxWait);
		ns.print(`expected loop at ${endTime.toLocaleTimeString()}`)
		if (!confFlags.skip) await ns.sleep(maxWait);
	} while (!confFlags.skip) // don't loop if --skip'ping
}