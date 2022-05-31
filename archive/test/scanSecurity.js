/** @param {NS} ns */
export async function main(ns) {
	let outputFile = `/output/${ns.getScriptName()}.txt`;
	let writeMode = "a";

	// let serverList = [
	// 	[true, "avmnite-02h", 0, 0, 0, 0],
	// 	[true, "catalyst", 0, 0, 0, 0],
	// 	[true, "computek", 0, 0, 0, 0],
	// 	[true, "crush-fitness", 0, 0, 0, 0],
	// 	// [true, "CSEC", 0, 0, 0, 0],
	// 	// [true, "foodnstuff", 0, 0, 0, 0],
	// 	[true, "galactic-cyber", 0, 0, 0, 0],
	// 	[true, "global-pharm", 0, 0, 0, 0],
	// 	// [true, "harakiri-sushi", 0, 0, 0, 0],
	// 	[true, "hong-fang-tea", 0, 0, 0, 0],
	// 	[true, "I.I.I.I", 0, 0, 0, 0],
	// 	[true, "iron-gym", 0, 0, 0, 0],
	// 	// [true, "joesguns", 0, 0, 0, 0],
	// 	[true, "johnson-ortho", 0, 0, 0, 0],
	// 	[true, "lexo-corp", 0, 0, 0, 0],
	// 	// [true, "max-hardware", 0, 0, 0, 0],
	// 	// [true, "n00dles", 0, 0, 0, 0],
	// 	// [true, "nectar-net", 0, 0, 0, 0],
	// 	// [true, "neo-net", 0, 0, 0, 0],
	// 	[true, "netlink", 0, 0, 0, 0],
	// 	[true, "omega-net", 0, 0, 0, 0],
	// 	[true, "phantasy", 0, 0, 0, 0],
	// 	[true, "rho-construction", 0, 0, 0, 0],
	// 	[true, "rothman-uni", 0, 0, 0, 0],
	// 	// [true, "sigma-cosmetics", 0, 0, 0, 0],
	// 	[true, "silver-helix", 0, 0, 0, 0],
	// 	[true, "snap-fitness", 0, 0, 0, 0],
	// 	[true, "summit-uni", 0, 0, 0, 0],
	// 	[true, "syscore", 0, 0, 0, 0],
	// 	[true, "the-hub", 0, 0, 0, 0],
	// 	[true, "zb-institute", 0, 0, 0, 0],
	// 	[true, "zer0", 0, 0, 0, 0],
	// ];

	let serverList = [
		// [true, "n00dles", 0, 0, 0, 0],
		// [true, "foodnstuff", 0, 0, 0, 0],
		// [true, "sigma-cosmetics", 0, 0, 0, 0],
		// [true, "joesguns", 0, 0, 0, 0],
		// [true, "max-hardware", 0, 0, 0, 0],
		[true, "phantasy", 0, 0, 0, 0],
		[true, "avmnite-02h", 0, 0, 0, 0],
		[true, "summit-uni", 0, 0, 0, 0],
		[true, "syscore", 0, 0, 0, 0],
		[true, "catalyst", 0, 0, 0, 0],
		// [true, "CSEC", 0, 0, 0, 0],
		[true, "omega-net", 0, 0, 0, 0],
		[true, "computek", 0, 0, 0, 0],
		[true, "I.I.I.I", 0, 0, 0, 0],
		[true, "johnson-ortho", 0, 0, 0, 0],
		[true, "zb-institute", 0, 0, 0, 0],
		[true, "crush-fitness", 0, 0, 0, 0],
		[true, "hong-fang-tea", 0, 0, 0, 0],
		// [true, "harakiri-sushi", 0, 0, 0, 0],
		[true, "iron-gym", 0, 0, 0, 0],
		[true, "zer0", 0, 0, 0, 0],
		// [true, "neo-net", 0, 0, 0, 0],
		[true, "netlink", 0, 0, 0, 0],
		[true, "rothman-uni", 0, 0, 0, 0],
		// [true, "nectar-net", 0, 0, 0, 0],
		[true, "silver-helix", 0, 0, 0, 0],
		[true, "the-hub", 0, 0, 0, 0],
	];

	// let serverList = [
	// 	[true, "avmnite-02h", 0, 0, 0, 0],
	// 	[true, "catalyst", 0, 0, 0, 0],
	// 	[true, "computek", 0, 0, 0, 0],
	// 	[true, "crush-fitness", 0, 0, 0, 0],
	// 	[true, "CSEC", 0, 0, 0, 0],
	// 	[true, "foodnstuff", 0, 0, 0, 0],
	// 	[true, "harakiri-sushi", 0, 0, 0, 0],
	// 	[true, "hong-fang-tea", 0, 0, 0, 0],
	// 	[true, "I.I.I.I", 0, 0, 0, 0],
	// 	[true, "iron-gym", 0, 0, 0, 0],
	// 	[true, "joesguns", 0, 0, 0, 0],
	// 	[true, "johnson-ortho", 0, 0, 0, 0],
	// 	[true, "max-hardware", 0, 0, 0, 0],
	// 	[true, "nectar-net", 0, 0, 0, 0],
	// 	[true, "neo-net", 0, 0, 0, 0],
	// 	[true, "netlink", 0, 0, 0, 0],
	// 	[true, "omega-net", 0, 0, 0, 0],
	// 	[true, "phantasy", 0, 0, 0, 0],
	// 	[true, "rothman-uni", 0, 0, 0, 0],
	// 	[true, "sigma-cosmetics", 0, 0, 0, 0],
	// 	[true, "silver-helix", 0, 0, 0, 0],
	// 	[true, "summit-uni", 0, 0, 0, 0],
	// 	[true, "syscore", 0, 0, 0, 0],
	// 	[true, "the-hub", 0, 0, 0, 0],
	// 	[true, "zb-institute", 0, 0, 0, 0],
	// 	[true, "zer0", 0, 0, 0, 0],
	// 	[true, "n00dles", 0, 0, 0, 0],
	// ];

	let toPrint = `\n+++\n${ns.getScriptName()} run on ${new Date().toLocaleString()}\n+++\n`;

	serverList.forEach((serverArray, serverIndex) => {
		// ns.tprint(`${ns.getServerRequiredHackingLevel(serverArray[1])} > ${ns.getHackingLevel()}`);ns.exit();
		if (ns.getServerRequiredHackingLevel(serverArray[1]) <= ns.getHackingLevel()) {
			let serverName = serverArray[1];
			let serverObject = ns.getServer(serverName);
			if (serverObject.hasAdminRights &&
				serverObject.hackDifficulty > 0 &&
				serverObject.hackDifficulty <= ns.getHackingLevel() &&
				serverObject.ramUsed > 0) { // only keep if has admin rights, is hackable, and running scripts
				serverArray[2] = serverObject.minDifficulty;
				serverArray[3] = serverObject.hackDifficulty;
				serverArray[4] = serverObject.baseDifficulty;
				if (serverObject.baseDifficulty === serverObject.minDifficulty) { // gets rid of infinity case
					serverArray[5] = -1;
				} else {
					serverArray[5] = Math.round(100 * serverObject.hackDifficulty / serverObject.minDifficulty);
				}
			} else {
				serverList.splice(serverIndex, 1); // remove element if it can't be weakened anyways
			}
		} else {
			serverList.splice(serverIndex, 1); // remove element if it can't be weakened anyways
		}
	})

	// sort remaining array
	serverList.sort((a, b) => b[4] - a[4]);
	// build output from resulting array
	serverList.forEach(serverArray => {
		let serverName = serverArray[1];
		// get tabs needed
		let numTabs = 3;
		let tabs = "";
		for (let i = serverName.length; i >= 0 && numTabs >= 0; i -= 8) numTabs--;
		for (let i = 0; i < numTabs; i++) tabs += "\t";
		let currDiff = Math.round(10 * serverArray[3]/*hackDifficulty*/) / 10;
		let diffPercent = serverArray[5]/*diffPercent*/;
		// (serverArray[4]/*baseDifficulty*/ === serverArray[2]/*minDifficulty*/) ? diffPercent = 0 : diffPercent = diffPercent;
		toPrint += `${serverName}${tabs}${serverArray[2]/*minDifficulty*/}\t${currDiff}\t${serverArray[4]/*baseDifficulty*/}\t${diffPercent}%\n`;
	})
	ns.tprint(toPrint);
	ns.write(outputFile, toPrint, writeMode);
}