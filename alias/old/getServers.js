/** @param {NS} ns */
export async function main(ns) {
	// initialize hash of host map
	let hostJSON = { "home": { "depth": 0, "parent": null, "backdoor": false } };
	let maxDepth = 20;

	scanHost();
	ns.tprint(hostJSON);
	ns.tprint(Object.keys(hostJSON).sort());

	// FUNCTIONS BELOW HERE
	function scanHost() {
		scanHostHelper("home", 1);
	}
	// TODO count children and include in json
	function scanHostHelper(hostName, depth) {
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
				ns.tprint(`${childName}: ${Math.round(childObject.requiredHackingSkill)}`)
				scanHostHelper(childName, depth + 1);
			}
		})
	}
}