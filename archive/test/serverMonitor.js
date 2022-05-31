import { buildServerList, getScriptsByArgs } from '/lib/helpers.js';

export function autocomplete(data, args) { return [...data.servers]; }
/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("sleep");
	ns.disableLog("scan");
	// ns.disableLog("exec");
	let nThreads = 1;
	// TODO use expectedScripts to search ONLY for those scripts
	let expectedScripts = [
		// { name: "/hgw/w.js", found: false, required: true, },
		{ name: "smartHack.js", found: false, required: true, },
		// { name: "/alias/smartGrow.js", found: false, required: false, },
	];
	let serverList = (ns.args.length > 0) ? ns.args : buildServerList(ns);
	for (const serverName of serverList) { // build list of servers that need to be monitored
		let serverObject = ns.getServer(serverName);
		if (serverObject.hasAdminRights && serverObject.moneyMax > 0) { // rooted with money
			let found = 0;
			for (const script of getScriptsByArgs(ns, serverName)) {
				//script. args filname pid threads server
				if (script.filename === "/test/loop.js") found++;
				// if (script.filename === "smartHack.js") found++;
				// ns.tprint(`${serverName}: ${script.filename}`);
				// TODO check to make sure all expectedScripts exist, and alert/warn if any are missing
			}
			if (found != 1) {
				ns.print(`INFO: ${serverName} is missing scripts. $ ${ns.nFormat(serverObject.moneyAvailable, "0,0.00")}`);
				// ns.exec("smartHack.js", "home", nThreads, serverName);
				try { ns.exec("/alias/putScript.js", "home", 1, serverName, "s=weaken.js", serverName); } catch { }
			// } else if (found > 1) {
			// 	ns.tprint(`WARNING: ${serverName} is too many scripts running?!? $ ${ns.nFormat(serverObject.moneyAvailable, "0,0.00")}`);
			// 	ns.print(`WARNING: ${serverName} is too many scripts running?!? $ ${ns.nFormat(serverObject.moneyAvailable, "0,0.00")}`);
			}
			await ns.sleep(20);
		}
	}
}