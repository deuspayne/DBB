/** @param {NS} ns */
export async function main(ns) {
	let outputFile = `/output/${ns.getScriptName()}.txt`;
	let writeMode = "a";

	let serverList = [
		"avmnite-02h",
		"catalyst",
		"computek",
		"crush-fitness",
		"CSEC",
		"foodnstuff",
		"galactic-cyber",
		"global-pharm",
		"harakiri-sushi",
		"hong-fang-tea",
		"I.I.I.I",
		"iron-gym",
		"joesguns",
		"johnson-ortho",
		"lexo-corp",
		"max-hardware",
		"n00dles",
		"nectar-net",
		"neo-net",
		"netlink",
		"omega-net",
		"phantasy",
		"rho-construction",
		"rothman-uni",
		"sigma-cosmetics",
		"silver-helix",
		"snap-fitness",
		"summit-uni",
		"syscore",
		"the-hub",
		"zb-institute",
		"zer0",
	];

	let toPrint = `\n+++\n${ns.getScriptName()} run on ${new Date().toLocaleString()}\n+++\n`;
	serverList.forEach(serverName => {
		toPrint += "---\n" + serverName + "\n---\n";
		let serverObject = ns.getServer(serverName);
		for (const key in serverObject) {
			toPrint += `${key}: ${serverObject[key]}\n`;
		}
	})

	ns.tprint(toPrint);
	ns.write(outputFile, toPrint, writeMode);
}