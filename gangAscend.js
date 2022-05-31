let argSchema = [
	['help', false],
	['h', false],
	['tail', false],
	['ascend', false],
	['mult', 2],
	['verbose', false],
	['name', []],
	['n', []],
]
export function autocomplete(data, args) {
	data.flags(argSchema);
	return [];
}
/** @param {NS} ns */
export async function main(ns) {
	let argFlags = ns.flags(argSchema);
	if (argFlags.help || argFlags.h) {
		ns.tprintf("INFO: TODO stuff about gangAscend");
		ns.tprintf("INFO: gAscend --multi 2 --ascend --verbose");
		ns.exit();
	}
	let gInfo = ns.gang.getGangInformation();
	let gList = ns.gang.getMemberNames();
	let gListFromArgs = argFlags.name.concat(argFlags.n);
	if (gListFromArgs.length > 0) gList = gListFromArgs;
	for (const gmName of gList) {
		let ascension = ns.gang.getAscensionResult(gmName);
		if (argFlags.verbose) ns.tprint(ascension);
		let argToCompare = (ascension != null) ? (gInfo.isHacking) ? ascension.hack : (ascension.str + ascension.def + ascension.dex + ascension.agi) / 4 : false;
		if (argToCompare > argFlags.mult) {
			let taskToSet = (gInfo.isHacking) ? "Train Hacking" : "Train Combat";
			if (argFlags.ascend) {
				ns.gang.ascendMember(gmName);
				ns.gang.setMemberTask(gmName, taskToSet);
				ns.tprint(`Ascended ${gmName} for average of ${argToCompare} combat multiplier. Set task to ${taskToSet}`);
			}
			else {
				ns.tprint(`NO ACTUAL ASCEND or task assign! ${gmName}: ${argToCompare}: ${taskToSet}`);
			}
		}
	}

}