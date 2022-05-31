import { buildServerList, getScriptsByArgs } from '/lib/helpers.js';

export function autocomplete(data, args) {
	return [...data.servers, "--tail"];
}
/** @param {NS} ns */
export async function main(ns) {
	// TODO flag processing. 
	//  tLimit, 2000
	//  hostName, "home"
	//  hackThreads, 100
	ns.disableLog("sleep");
	ns.disableLog("scan");
	ns.disableLog("exec");
	let scriptName1 = "autoGrow.old.js";
	let hostName = "Deus16384";
	let tLimitMax = 100;
	let scriptName2 = "smartHack.js";
	let hackThreads = 10;

	try { ns.getServer(hostName) } catch { hostName = "home"; tLimitMax /= 2; } // if server doesn't exist, set to home with lower tLimit

	let serverList = (ns.args.length > 0) ? ns.args : buildServerList(ns); // TODO put in flag processing so that --tLimit can be passed here too
	for (const serverName of serverList) { // build list of servers that need to be monitored
		let serverObject = ns.getServer(serverName);
		if (serverObject.hasAdminRights && serverObject.moneyMax > 0) { // rooted with money
			let found = 0;
			for (const script of getScriptsByArgs(ns, serverName)) {
				//script. args filname pid threads server
				if (script.filename === scriptName1 | script.filename === scriptName2) found++;
				// if (script.filename === "smartHack.js") found++;
				// ns.tprint(`${serverName}: ${script.filename}`);
				// TODO check to make sure all expectedScripts exist, and alert/warn if any are missing
			}
			if (found < 2) {
				ns.print(`INFO: ${serverName} is missing scripts. $ ${ns.nFormat(serverObject.moneyAvailable, "0,0.00")}`);
				// ns.exec("smartHack.js", "home", nThreads, serverName);

				// puts the file on the server
				await ns.scp("/lib/helpers.js", serverName);
				await ns.scp(scriptName1, serverName);
				let whereToRun = serverName;
				if (serverObject.maxRam < ns.getScriptRam(scriptName1, whereToRun)) whereToRun = "home"; // TODO better logic for failover of where to launch
				try { ns.exec(scriptName1, whereToRun, 1, serverName, "--tLimit", tLimitMax, "--hostName", hostName); } catch { } // 
				try { ns.exec(scriptName2, "home", hackThreads, serverName,); } catch { } // 
				// try { ns.exec("/alias/putScript.js", "home", 1, serverName, `s=${scriptName2}`, serverName); } catch { }
				// } else if (found > 1) {
				// 	ns.tprint(`WARNING: ${serverName} is too many scripts running?!? $ ${ns.nFormat(serverObject.moneyAvailable, "0,0.00")}`);
				// 	ns.print(`WARNING: ${serverName} is too many scripts running?!? $ ${ns.nFormat(serverObject.moneyAvailable, "0,0.00")}`);
			}
			await ns.sleep(20);
		}
	}
}