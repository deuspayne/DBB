/** Helper to get a list of all hostnames on the network
 * @param {NS} ns - The nestcript instance passed to your script's main entry point */
export function buildServerList(ns) {
	checkNsInstance(ns, '"buildServerList"');
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

/** Helper to get a list of running scripts on the network that have the passed val as an arg
 * @param {NS} ns - The nestcript instance passed to your script's main entry point 
 * @param {string} grepStr - The string of the argument to find in the running scripts (null val will return all scripts)
 * @returns process[] */
export function getScriptsByArgs(ns, grepStr) {
	checkNsInstance(ns, '"getScriptsByArgs"');
	let foundScripts = [];
	for (const serverName of buildServerList(ns)) {
		for (const process of ns.ps(serverName)) {
			process.server = serverName; // add server element to process object
			if (grepStr === null || process.args.includes(grepStr)) foundScripts.push(process);
		}
	}
	return foundScripts;
}

/** @param {NS} ns 
 * Returns a helpful error message if we forgot to pass the ns instance to a function */
export function checkNsInstance(ns, fnName = "this function") {
	if (!ns.print) throw `The first argument to ${fnName} should be a 'ns' instance.`;
	return ns;
}