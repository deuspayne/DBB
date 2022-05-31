let argSchema = [
	['tail', false],
	['help', false],
];
export function autocomplete(data, args) {
	data.flags(argSchema); // adds --flags to autocomplete
}
/** @param {NS} ns */
export async function main(ns) {
	let argFlags = ns.flags(argSchema);
	if (argFlags.help) {
		ns.tprintf("INFO: gangMonitor.js --help");
		ns.tprintf("INFO: TODO: gangMonitor --tail --help");
		ns.exit();
	}

	let gObj = ns.gang.getGangInformation();
	for (const key in gObj) {
		ns.tprintf("%24s: %s",
			key,
			gObj[key],
		);
	}
	ns.tprintf("===============================");
	for (const gmName of ns.gang.getMemberNames()) {
		let gmiObj = ns.gang.getMemberInformation(gmName);
		for (const key in gmiObj) {
			ns.tprintf("%15s: %s",
				key,
				gmiObj[key],
			)
		}
		ns.tprintf("-------------------------------");
	}
}