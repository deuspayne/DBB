let argSchema = [
	["tail", false],
	["sort", "m20PerTime",],
	["limit", 99],
]
export function autocomplete(data, args) {
	data.flags(argSchema); // adds --flags to autocomplete
	let acArray = [
		"diffPct",
		"growPerTime",
		"growTime",
		"hackDifficulty",
		"hackTime",
		"m20PerTime",
		"minDifficulty",
		"moneyAvailable",
		"moneyExpected",
		"moneyMax",
		"moneyPerTime",
		"mPct",
		"name",
		"serverGrowth",
		"t20Pct",
		"tMax",
		"toGrow",
		"weakenTime",
	];
	return acArray;
}

/** @param {NS} ns */
export async function main(ns) {
	let argFlags = ns.flags(argSchema);
	let sortKey = argFlags.sort;

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

	ns.tprintf(`Running moneyFinder showing all servers with Money`);
	let totalMoney = 0;
	let totalMaxMoney = 0;
	let numServers = 0;
	// serverHashList.forEach(serverName => {
	for (let i = 0; i < serverHashList.length; i++) {
		let serverObject = ns.getServer(serverHashList[i]["name"]);
		if (!serverObject.hasAdminRights || serverObject.moneyMax == 0 || serverObject.requiredHackingSkill > ns.getHackingLevel()) {
			// can't hack anyways or no money to get
			serverHashList.splice(i, 1);
			i--;
		} else {
			// build values in hash list
			serverHashList[i].moneyAvailable = serverObject.moneyAvailable;
			serverHashList[i].moneyMax = serverObject.moneyMax;
			serverHashList[i].toGrow = serverObject.moneyMax - serverObject.moneyAvailable;
			serverHashList[i].mPct = serverObject.moneyAvailable / serverObject.moneyMax;
			serverHashList[i].serverGrowth = serverObject.serverGrowth;
			serverHashList[i].moneyExpected = ns.hackAnalyze(serverHashList[i].name) * serverObject.moneyAvailable;
			serverHashList[i].growTime = ns.getGrowTime(serverHashList[i].name);
			serverHashList[i].growPerTime = 6000 * serverHashList[i].serverGrowth / serverHashList[i].growTime;
			serverHashList[i].hackTime = ns.getHackTime(serverHashList[i].name);
			serverHashList[i].weakenTime = ns.getWeakenTime(serverHashList[i].name);
			serverHashList[i].hackDifficulty = serverObject.hackDifficulty;
			serverHashList[i].minDifficulty = serverObject.minDifficulty;
			serverHashList[i].diffPct = 100 * (serverObject.hackDifficulty - serverObject.minDifficulty) / serverObject.minDifficulty;
			serverHashList[i].moneyPerTime = 60000 * serverHashList[i].moneyExpected / serverHashList[i].weakenTime;
			serverHashList[i].t20Pct = .2 / ns.hackAnalyze(serverHashList[i].name);
			serverHashList[i].tMax = serverHashList[i].t20Pct / .05;
			serverHashList[i].m20PerTime = (.06 * .2 * serverObject.moneyAvailable) / serverHashList[i].weakenTime;
			if (!isFinite(serverHashList[i].t20Pct)) serverHashList[i].t20Pct = "999999";
			if (!isFinite(serverHashList[i].tMax)) serverHashList[i].tMax = "999999";
		}
	}

	// sort list
	// serverHashList.sort((a, b) => { return a["diffPct"] - b["diffPct"] })
	serverHashList.sort((a, b) => { return b[sortKey] - a[sortKey]; })

	let formatArray = [
		{ "width": -18, "name": "Server Name", },
		{ "width": 18, "name": "moneyAvailable", },
		// { "width": 16, "name": "toGrow", },
		{ "width": 18, "name": "moneyMax", },
		{ "width": 4, "name": "mPct", },
		// { "width": 13, "name": "moneyExpected", },
		{ "width": 5, "name": "hTime", },
		// { "width": 12, "name": "serverGrowth", },
		{ "width": 5, "name": "gTime", },
		// { "width": 11, "name": "growPerTime", },
		{ "width": 6, "name": "wTime", },
		{ "width": 9, "name": "diffPct", },
		// { "width": 14, "name": "hackDifficulty", },
		// { "width": 13, "name": "minDifficulty", },
		{ "width": 10, "name": "m20PerTime", },
		// { "width": 12, "name": "moneyPerTime", },
		{ "width": 7, "name": "t20Pct", },
		{ "width": 7, "name": "tMax" },
	];
	let formatString = "";;
	let formatName = [];
	let formatDivider = [];
	for (const key in formatArray) {
		formatString += `%${formatArray[key]["width"]}s `;
		formatName.push(formatArray[key]["name"]);
		formatDivider.push('-'.repeat(Math.abs(formatArray[key]["width"])));
	}
	ns.tprintf(formatString, ...formatDivider);
	ns.tprintf(formatString, ...formatName);
	ns.tprintf(formatString, ...formatDivider);
	serverHashList.slice(0, argFlags.limit).forEach(server => {
		ns.tprintf(
			formatString,
			server["name"],
			ns.nFormat(server.moneyAvailable, "$0,0"),
			// formatter.format(server["toGrow"]),
			ns.nFormat(server.moneyMax, "$0,0"),
			ns.nFormat(server.mPct, "0%"),
			// formatter.format(server["moneyExpected"]),
			ns.nFormat(server.hackTime / 60000, "0,0.00"),
			// formatter.format(server["serverGrowth"]), // unknown what this value actually is
			ns.nFormat(server.growTime / 60000, "0,0.00"),
			// formatter.format(server["growPerTime"]),
			ns.nFormat(server.weakenTime / 60000, "0,0.00"),
			(.01 * Math.round(100 * server.diffPct)).toFixed(2) + " %",
			// (.01*Math.round(100*server.hackDifficulty)).toFixed(2),
			// (.01*Math.round(100*server.minDifficulty)).toFixed(2),
			ns.nFormat(server.m20PerTime, "$0,0") + " M",
			// ns.nFormat(server.moneyPerTime, "$0,0"),
			ns.nFormat(server.t20Pct, "0,0"),
			ns.nFormat(server.tMax, "0,0"),
		);
		// increment total money
		totalMoney += server.moneyAvailable;
		totalMaxMoney += server.moneyMax;
		numServers++;
	})
	ns.tprintf("$%s of $%s (%s) total across (%s) hackable servers",
		totalMoney.toLocaleString(),
		totalMaxMoney.toLocaleString(),
		ns.nFormat(totalMoney / totalMaxMoney, "0,0.0%"),
		numServers);
}