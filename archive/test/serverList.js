/** Helper to get a list of all hostnames on the network
 * @param {NS} ns - The nestcript instance passed to your script's main entry point */
export function scanAllServers(ns) {
	checkNsInstance(ns, '"scanAllServers"');
	let discoveredHosts = []; // Hosts (a.k.a. servers) we have scanned
	let hostsToScan = ["home"]; // Hosts we know about, but have no yet scanned
	let infiniteLoopProtection = 9999; // In case you mess with this code, this should save you from getting stuck
	while (hostsToScan.length > 0 && infiniteLoopProtection-- > 0) { // Loop until the list of hosts to scan is empty
		let hostName = hostsToScan.pop(); // Get the next host to be scanned
		for (const connectedHost of ns.scan(hostName)) // "scan" (list all hosts connected to this one)
			if (!discoveredHosts.includes(connectedHost)) // If we haven't already scanned this host
				hostsToScan.push(connectedHost); // Add it to the queue of hosts to be scanned
		discoveredHosts.push(hostName); // Mark this host as "scanned"
	}
	return discoveredHosts; // The list of scanned hosts should now be the set of all hosts in the game!
}
/** @param {NS} ns 
 * Returns a helpful error message if we forgot to pass the ns instance to a function */
export function checkNsInstance(ns, fnName = "this function") {
	if (!ns.print) throw `The first argument to ${fnName} should be a 'ns' instance.`;
	return ns;
}
// export function getServerArray(ns) {
// 	getServers(ns, "array");
// }

// export function getServerHash(ns) {
// 	getServers(ns, "hash");
// }

// export function getServers(ns, retType = "array") {
// 	// initialize hash of host map
// 	let hostJSON = { "home": { "depth": 0, "parent": null, "backdoor": false } };

// 	// oldScan_Host();
// 	hostJSON = scanHostHelper(ns, "home", 1, hostJSON);
// 	switch (retType) {
// 		case "hash":
// 			let hostHashList = [];
// 			hostJSON.forEach(key => { hostHashList.push({ "name": key }); })
// 			return hostHashList;
// 		case "array":
// 		default:
// 			return Object.keys(hostJSON).sort();
// 	}
// 	// ns.tprint(hostJSON);
// 	// ns.tprint(Object.keys(hostJSON).sort());
// }

// // FUNCTIONS BELOW HERE
// // export function oldScan_Host() {
// // 	scanHostHelper("home", 1);
// // }
// // TODO count children and include in json
// export function scanHostHelper(ns, hostName, depth, hostJSON) {
// 	let maxDepth = 15;
// 	if (depth > maxDepth) return;
// 	let newList = ns.scan(hostName);
// 	newList.forEach(childName => {
// 		let hashKeys = Object.keys(hostJSON);
// 		if (!hashKeys.includes(childName)) { // host isn't in list
// 			let childObject = ns.getServer(childName);
// 			hostJSON[childName] = {
// 				"depth": depth,
// 				"parent": hostName,
// 				"backdoor": childObject.backdoorInstalled,
// 				"hackDifficulty": Math.round(childObject.hackDifficulty),
// 			};
// 			scanHostHelper(childName, depth + 1);
// 		}
// 	})
// }