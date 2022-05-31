let argSchema = [
	['tail', false],
	['help', false],
	['task', "Train Combat"],
	// ['money', false],
	// ['train', false],
	// ['reputation', false],
	// ['wanted', false],
	['pulse', false],
	['exclude', []],
	['i', []],
	['minStats', 0],
	['maxStats', Infinity],
];
export function autocomplete(data, args) {
	data.flags(argSchema); // adds --flags to autocomplete
	return [
		`"Mug People"`,
		`"Deal Drugs"`,
		`"Strongarm Civilians"`,
		`"Run a Con"`,
		`"Armed Robbery"`,
		`"Traffick Illegal Arms"`,
		`"Threaten & Blackmail"`,
		`"Human Trafficking"`,
		`"Terrorism"`,
		`"Vigilante Justice"`,
		`"Train Combat"`,
		`"Train Hacking"`,
		`"Train Charisma"`,
		`"Territory Warfare"`,
	];
}
/** @param {NS} ns */
export async function main(ns) {
	let argFlags = ns.flags(argSchema);
	if (argFlags.help) {
		ns.tprintf("INFO: gangSetJob.js --help");
		ns.tprintf("INFO: TODO: gangSetJob --tail --help");
		ns.tprint(ns.gang.getTaskNames());
		ns.exit();
	}
	let task = argFlags.task;
	// if (argFlags.money) { task = "Traffick Illegal Arms"; }
	// if (argFlags.train) { task = "Train Combat"; }
	// if (argFlags.reputation) { task = "Terrorism"; }
	// if (argFlags.wanted) { task = "Vigilante Justice"; }

	let odd = true;
	let gmList = ns.gang.getMemberNames();
	if (argFlags.i.length > 0) gmList = argFlags.i;
	let gInfo = ns.gang.getGangInformation();
	for (const gmName of gmList) {
		if (!argFlags.exclude.includes(gmName)) {
			if (argFlags.pulse) {
				if (odd) task = (gInfo.isHacking)? "Train Hacking": "Train Combat";
				else task = "Territory Warfare";
				odd = !odd;
			}
			// check gang members stats
			let mObj = ns.gang.getMemberInformation(gmName);
			let toCompare = (gInfo.isHacking)? mObj.hack : (mObj.str + mObj.def + mObj.dex + mObj.agi) / 4;
			if (argFlags.minStats <= toCompare && toCompare <= argFlags.maxStats) {
				ns.gang.setMemberTask(gmName, task);
			}
		}
	}
}