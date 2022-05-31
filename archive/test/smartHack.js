// TODO make this a script that only needs 1 thread,
// and launches a hackOnce.js, weakenOnce.js, or growOnce.js

//TODO make a copy of this and try and see if it can be run with Formulas.exe
export function autocomplete(data, args) {
	return [...data.servers];
}
/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("sleep");
	let serverList = ns.args;
	let securityLimit = .05;
	let moneyLimit = .95;
	while (true) { // forever loop
		for (const key in serverList) { // loop over servers
			let serverName = serverList[key];
			let serverObject = ns.getServer(serverName);
			while (serverObject.moneyAvailable / serverObject.moneyMax < moneyLimit) { // while money low
				while ((serverObject.hackDifficulty - serverObject.minDifficulty) / serverObject.minDifficulty > securityLimit) { // while security high
					await ns.weaken(serverName);
					serverObject = ns.getServer(serverName);
				}
				await ns.grow(serverName);
				serverObject = ns.getServer(serverName);
			}
			await ns.hack(serverName);
			serverObject = ns.getServer(serverName);
		}
		await ns.sleep(100); // sleep 0.1 second before looping
	}
}