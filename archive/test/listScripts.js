export function autocomplete(data, args) {
	return [...data.servers, ...data.scripts];
}
/** @param {NS} ns */
export async function main(ns) {
	let grepStr = ns.args[0] || "";
	let sortStr = "pid";
	let hostJSON = { "home": { "depth": 0, "parent": null, "backdoor": false } };
	let maxDepth = 20;
	buildHostList();
	let serverList = Object.keys(hostJSON).sort();

	let allScripts = [];

	serverList.forEach(serverName => {
		let processList = ns.ps(serverName);
		processList.forEach(process => {
			process.server = serverName;
			if (serverName === grepStr || process.filename === grepStr) allScripts.push(process);
			else {
				process.args.forEach(arg => {
					if (arg === grepStr) allScripts.push(process);
				})
			}

		})
	})

	allScripts.sort((a, b) => { return a[sortStr] - b[sortStr]; }) // sort by sortStr
	allScripts.forEach(scriptProcess => { ns.tprint(scriptProcess); })


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