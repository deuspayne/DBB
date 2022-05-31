/** @param {NS} ns */
export async function main(ns) {
	let fileName = ns.getScriptName();
	let fileNameArray = fileName.split("/");
	let outputFile = `/output/${fileNameArray[fileNameArray.length - 1]}.txt`;
	let writeMode = "a";

	let myHackingLevel = ns.getHackingLevel();
	let weakenValue = 0.05;

	let serverHashList = [
		{ name: "." },
		{ name: "4sigma" },
		{ name: "CSEC" },
		{ name: "I.I.I.I" },
		{ name: "The-Cave" },
		{ name: "aerocorp" },
		{ name: "aevum-police" },
		{ name: "alpha-ent" },
		{ name: "applied-energetics" },
		{ name: "avmnite-02h" },
		{ name: "b-and-a" },
		{ name: "blade" },
		{ name: "catalyst" },
		{ name: "clarkinc" },
		{ name: "computek" },
		{ name: "crush-fitness" },
		// { name: "darkweb" },
		{ name: "defcomm" },
		{ name: "deltaone" },
		{ name: "ecorp" },
		{ name: "foodnstuff" },
		{ name: "fulcrumassets" },
		{ name: "fulcrumtech" },
		{ name: "galactic-cyber" },
		{ name: "global-pharm" },
		{ name: "harakiri-sushi" },
		{ name: "helios" },
		{ name: "home" },
		{ name: "hong-fang-tea" },
		{ name: "icarus" },
		{ name: "infocomm" },
		{ name: "iron-gym" },
		{ name: "joesguns" },
		{ name: "johnson-ortho" },
		{ name: "kuai-gong" },
		{ name: "lexo-corp" },
		{ name: "max-hardware" },
		{ name: "megacorp" },
		{ name: "microdyne" },
		{ name: "millenium-fitness" },
		{ name: "n00dles" },
		{ name: "nectar-net" },
		{ name: "neo-net" },
		{ name: "netlink" },
		{ name: "nova-med" },
		{ name: "nwo" },
		{ name: "omega-net" },
		{ name: "omnia" },
		{ name: "omnitek" },
		{ name: "phantasy" },
		{ name: "powerhouse-fitness" },
		{ name: "rho-construction" },
		{ name: "rothman-uni" },
		{ name: "run4theh111z" },
		{ name: "sigma-cosmetics" },
		{ name: "silver-helix" },
		{ name: "snap-fitness" },
		{ name: "solaris" },
		{ name: "stormtech" },
		{ name: "summit-uni" },
		{ name: "syscore" },
		{ name: "taiyang-digital" },
		{ name: "the-hub" },
		{ name: "titan-labs" },
		{ name: "unitalife" },
		{ name: "univ-energy" },
		{ name: "vitalife" },
		{ name: "zb-def" },
		{ name: "zb-institute" },
		{ name: "zer0" },
		{ name: "zeus-med" },
	];

	// iterate through serverHashList and remove unhackable servers (aka: too difficult)
	for (let i = 0; i < serverHashList.length; i++) {
		let serverName = serverHashList[i]["name"];
		let serverRequiredHackingLevel = ns.getServerRequiredHackingLevel(serverName);

		if (serverRequiredHackingLevel > myHackingLevel) { // unhackable with current hack skill, splicing out
			serverHashList.splice(i, 1);
			i--;
		} else {
			let serverObject = ns.getServer(serverName);
			if (serverObject.minDifficulty === serverObject.hackDifficulty) { // current difficulty is min, no need to include
				serverHashList.splice(i, 1);
				i--;
			} else {
				serverHashList[i]["serverRequiredHackingLevel"] = serverRequiredHackingLevel;
				serverHashList[i]["hackDifficulty"] = serverObject.hackDifficulty;
				serverHashList[i]["minDifficulty"] = serverObject.minDifficulty;
				serverHashList[i]["diffDiff"] = serverObject.hackDifficulty - serverObject.minDifficulty;
				serverHashList[i]["diffDiff%"] = 100 * (serverObject.hackDifficulty - serverObject.minDifficulty) / serverObject.minDifficulty;
				serverHashList[i]["weakenTime"] = ns.getWeakenTime(serverName);
			}
		}
	}

	// sort list by largest difference from minimum
	serverHashList.sort((a, b) => {
		if (a["diffDiff%"] != b["diffDiff%"]) return b["diffDiff%"] - a["diffDiff%"];
		else return b["diffDiff"] - a["diffDiff"];
	});

	// iterate over list and display table of values
	let printFormat = "%-18s%10s%9s%9s";
	ns.tprintf(
		printFormat,
		"Name",
		"Difficulty",
		"Diff %",
		"Num todo",
	);
	ns.tprintf(
		printFormat,
		"----",
		"----------",
		"--------",
		"--------",
	);
	serverHashList.forEach(ele => {
		if (ele["diffDiff"] > 1) {
			ns.tprintf(
				printFormat,
				ele["name"],
				ele["hackDifficulty"].toFixed(2),
				ele["diffDiff%"].toFixed(2) + " %",
				ele["diffDiff"].toFixed(2),
			);
		}
	});
}