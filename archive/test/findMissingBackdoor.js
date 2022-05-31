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
		"summit-uni",
		"syscore",
		"catalyst",
		"CSEC",
		"omega-net",
		"computek",
		"I.I.I.I",
		"johnson-ortho",
		"zb-institute",
		"crush-fitness",
		"hong-fang-tea",
		"harakiri-sushi",
		"iron-gym",
		"zer0",
		"neo-net",
		"netlink",
		"rothman-uni",
		"nectar-net",
		"silver-helix",
		"the-hub",
	];

	// defaults outputFile to tmp.txt with append write mode
	let outputFile = "missingBackdoors.txt";
	let writeMode = "a";
	switch (ns.args.length) {
		case 1:
			outputFile = ns.args[0];
			break;
		case 2:
			outputFile = ns.args[0];
			writeMode = ns.args[1];
			switch(ns.args[1]) {
				case "a":
				case "w":
					break;
				default:
					ns.tprint("WARNING: Unknown write mode, defaulting to append");
					writeMode = "a";
					break;
			}
			break;
		case 0:
		default:
			ns.tprint("WARNING: incorrect number of arguments. expecting 0-2.");
			ns.tprint("WARNING: usage: 1) output file 2) write mode");
			ns.tprint("WARNING: defaulting to tmp.txt and append");
			break;
	}

	// loop through list
	let toWrite = "";
	(writeMode === "a") ? toWrite += "\n\n" : toWrite=toWrite;
	toWrite += "Created by running findMissingBackdoor.js on ";
	toWrite += new Date().toLocaleString();
	toWrite += "\n";
	serverList.forEach(serverName => {
		let serverObject = ns.getServer(serverName);
		if (serverObject.hasAdminRights && !serverObject.backdoorInstalled) {
			toWrite = toWrite.concat(serverName, " is missing a Backdoor\n");
		}
	});
	
	ns.tprint(toWrite);
	ns.write(outputFile, toWrite, writeMode);
}