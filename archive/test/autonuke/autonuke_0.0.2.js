/** @param {NS} ns */
export async function main(ns) {
	// defaults outputFile to tmp.txt with append write mode
	let outputFile = `/output/autonuke.txt`;
	let writeMode = "a";

	//// copied from serverList.js
	// list of all viewable servers
	let serverList = [
		".",
		"4sigma",
		"CSEC",
		"I.I.I.I",
		"The-Cave",
		"aerocorp",
		"aevum-police",
		"alpha-ent",
		"applied-energetics",
		"avmnite-02h",
		"b-and-a",
		"blade",
		"catalyst",
		"clarkinc",
		"computek",
		"crush-fitness",
		// "darkweb",
		"defcomm",
		"deltaone",
		"ecorp",
		"foodnstuff",
		"fulcrumassets",
		"fulcrumtech",
		"galactic-cyber",
		"global-pharm",
		"harakiri-sushi",
		"helios",
		"home",
		"hong-fang-tea",
		"icarus",
		"infocomm",
		"iron-gym",
		"joesguns",
		"johnson-ortho",
		"kuai-gong",
		"lexo-corp",
		"max-hardware",
		"megacorp",
		"microdyne",
		"millenium-fitness",
		"n00dles",
		"nectar-net",
		"neo-net",
		"netlink",
		"nova-med",
		"nwo",
		"omega-net",
		"omnia",
		"omnitek",
		"phantasy",
		"powerhouse-fitness",
		"rho-construction",
		"rothman-uni",
		"run4theh111z",
		"sigma-cosmetics",
		"silver-helix",
		"snap-fitness",
		"solaris",
		"stormtech",
		"summit-uni",
		"syscore",
		"taiyang-digital",
		"the-hub",
		"titan-labs",
		"unitalife",
		"univ-energy",
		"vitalife",
		"zb-def",
		"zb-institute",
		"zer0",
		"zeus-med",
	];
	// list of programs to open ports
	let crackerList = [
		["BruteSSH.exe", false],
		["FTPCrack.exe", false],
		["relaySMTP.exe", false],
		["HTTPWorm.exe", false],
		["SQLInject.exe", false],
	];
	// gets a number of executable files on home server
	//  and compares them against the list of 5 cracking programs
	//  to get a max number of ports that can be opened
	let numCrackable = 0;
	let lsRes = ns.ls("home", "exe")
	crackerList.forEach(cracker => {
		lsRes.find(lsEle => {
			if (lsEle === cracker[0]) {
				numCrackable++;
				cracker[1] = true;
			}
		});
	});

	// loop through list
	let toWrite = "\n---\nautonuke.js run on " + new Date().toLocaleString() + "\n---\n";
	let everyRetVal = true;
	serverList.every(serverName => {
		// get serverObject
		let serverObject = ns.getServer(serverName);

		switch (ns.args[0]) {
			case "p":
			case "po":
			case "port":
			case "ports":
				// check for missing admin rights and needed hacking skill/level
				if (!serverObject.hasAdminRights &&
					serverObject.requiredHackingSkill <= ns.getHackingLevel() &&
					numCrackable != 0 &&
					numCrackable >= serverObject.numOpenPortsRequired
				) {
					toWrite += (serverName + " found vulnerable. running hacks\n");
					// BruteSSH
					if (crackerList[0][1] && !serverObject.sshPortOpen) {
						toWrite += "attempting BruteSSH\n";
						ns.brutessh(serverName);
					}
					// FTPCrack
					if (crackerList[1][1] && !serverObject.ftpPortOpen) {
						toWrite += "attempting FTPCrack\n";
						ns.ftpcrack(serverName);
					}
					// relaySMTP
					if (crackerList[2][1] && !serverObject.smtpPortOpen) {
						toWrite += "attempting relaySMTP\n";
						ns.relaysmtp(serverName);
					}
					// HTTPWorm
					if (crackerList[3][1] && !serverObject.httpPortOpen) {
						toWrite += "attempting HTTPWorm\n";
						ns.httpworm(serverName);
					}
					// SQLInject
					if (crackerList[4][1] && !serverObject.sqlPortOpen) {
						toWrite += "attempting SQLInject\n";
						ns.sqlinject(serverName);
					}
					toWrite += "\n";

					// // Logging Data
					// toWrite += ("\n---\n" + serverName + "\n---\n");
					// toWrite += ("req skill: " + serverObject.requiredHackingSkill + "\n");
					// toWrite += ("ns.getHackingLevel(): " + ns.getHackingLevel() + "\n");
					// toWrite += ("Ports Needed: " + serverObject.numOpenPortsRequired + "\n");
					// toWrite += ("Open Ports: " + serverObject.openPortCount + "\n");
					// toWrite += "\n";
				}
				break;
			case "a":
			case "ad":
			case "admin":
			case "nuke":
				// no admin, hacking skill high enough, enough open ports
				if (!serverObject.hasAdminRights &&
					serverObject.requiredHackingSkill <= ns.getHackingLevel() &&
					serverObject.openPortCount >= serverObject.numOpenPortsRequired) {
					// doesn't have admin, nuking
					toWrite += (serverName + " doesn't have admin access. Nuking.\n");
					ns.nuke(serverName);
				}
				break;
			case "backdoor":
			case "bd":
				// check for missing backdor
				if (serverObject.hasAdminRights && !serverObject.backdoorInstalled) {
					toWrite += (serverName + " is missing a Backdoor\n");
					// todo Write code to auto install backdoor?
				}
				break;
			default:
				toWrite += "ports|backdoor|admin/nuke\n";
				everyRetVal = false;
		}
		return everyRetVal;
	});

	ns.tprint(toWrite);
	ns.write(outputFile, toWrite, writeMode);
}