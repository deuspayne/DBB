/** @param {NS} ns */
export async function main(ns) {
	let serverList = [
		"n00dles",
		"foodnstuff",
		"sigma-cosmetics",
		"joesguns",
		"max-hardware",
		"phantasy",
		"avmnite-02h",
		// "summit-uni",
		// "syscore",
		// "catalyst",
		// "CSEC",
		// "omega-net",
		// "computek",
		// "I.I.I.I",
		// "johnson-ortho",
		// "zb-institute",
		// "crush-fitness",
		// "hong-fang-tea",
		// "harakiri-sushi",
		// "iron-gym",
		// "zer0",
		// "neo-net",
		// "netlink",
		// "rothman-uni",
		// "nectar-net",
		// "silver-helix",
		// "the-hub",
	];
	serverList.forEach(serverName => {
		let serverObject = ns.getServer(serverName);
		ns.tprint("SERVER: " + serverName);
		for(const key in serverObject) {
			ns.tprint(`${key}: ${serverObject[key]}`);
		}
		ns.tprint("");
		ns.tprint("");
		// ns.tprint(serverName + " hasAdminRights:\t" + serverObject.hasAdminRights);
		// ns.tprint("$" + Math.round(serverObject.moneyAvailable) + " of $" + serverObject.moneyMax + " max.")
		// ns.tprint(serverObject.minDifficulty + " : " + serverObject.baseDifficulty + " : " + serverObject.hackDifficulty);
	});
}