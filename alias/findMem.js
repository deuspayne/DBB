/** @param {NS} ns */
export async function main(ns) {
	let percentFree = (ns.args.length > 0) ? ns.args[0] / 100 : .20;
	let hostJSON = { "home": { "depth": 0, "parent": null, "backdoor": false } };
	let maxDepth = 20;
	buildHostList();
	let serverList = Object.keys(hostJSON).sort();

	ns.tprintf(`Running findMem showing all servers with more than %f %% Free Memory`, percentFree * 100);

	let numServers = 0;
	let memFree = 0;
	let memMax = 0;
	serverList.forEach(serverName => {
		let serverObject = ns.getServer(serverName);
		let freeRam = serverObject.maxRam - serverObject.ramUsed;
		if (serverObject.hasAdminRights && (freeRam > serverObject.maxRam * percentFree || percentFree < 0)) {
			numServers++;
			memFree+=freeRam;
			// ns.print(`serverObject.maxRam : ${serverObject.maxRam}`); // TODO DELETE ME
			// ns.print(`serverObject.ramUsed: ${serverObject.ramUsed}`); // TODO DELETE ME
			// ns.print(`freeRam: ${freeRam}`); // TODO DELETE ME
			memMax+=serverObject.maxRam;
			ns.tprintf(`%-18s %12s GB Free %12s Max GB Cores: %s BD: %5s %4s %20s`,
				serverName,
				ns.nFormat(freeRam, "0,0.00"),// freeRam.toFixed(2),
				ns.nFormat(serverObject.maxRam, "0,0.00"), // serverObject.maxRam.toFixed(2),
				serverObject.cpuCores,
				serverObject.backdoorInstalled,
				ns.getServerRequiredHackingLevel(serverName),
				ns.nFormat(serverObject.moneyAvailable, "$ 0,0.00"),  //.toLocaleString(),
			);
		}
	})
	ns.tprintf(`%s GB of %s GB on [%s] servers with %s+ free memory.`,
		memFree,
		memMax,
		numServers,
		ns.nFormat(percentFree, "0%"),
	);

	function buildHostList() {
		buildHostHelper("home", 1);
	}
	function buildHostHelper(hostName, depth) {
		if (depth > maxDepth) return;
		let newList = ns.scan(hostName);
		newList.forEach(childName => {
			let hashKeys = Object.keys(hostJSON);
			if (!hashKeys.includes(childName)) { // host isn't in list
				let childObject = ns.getServer(childName);
				hostJSON[childName] = {
					"depth": depth,
					"parent": hostName,
					"backdoor": childObject.backdoorInstalled,
					"hackDifficulty": Math.round(childObject.hackDifficulty),
				};
				buildHostHelper(childName, depth + 1);
			}
		})
	}
}