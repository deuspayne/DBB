let argSchema = [
	['h', false],
	['tail', false],
	['hThreads', 0],
	['gThreads', 0],
	['cores', 1], // TODO: pull cores from host being checked
	// ['hPercent', 0],
	// ['gPercent', 0],
];
export function autocomplete(data, args) {
	data.flags(argSchema); // adds flags to autocomplete
	return [...data.servers];
}

/** @param {NS} ns */
export async function main(ns) {
	let argFlags = ns.flags(argSchema);

	/////////////////////////////////
	// ns.clearLog();
	ns.print("");
	ns.print(new Date().toLocaleTimeString());
	ns.print(argFlags);
	/////////////////////////////////

	if (argFlags.h) {
		ns.tprint("INFO: threadAnalyzer -h");
		ns.tprint("TODO: INFO ABOUT threadAnalyzer");
		ns.tprint("threadAnalyzer --(h/g)Threads # ");
		// TODO eventually put in stuff for --(h/g)Percent
		ns.exit();
	} else if (argFlags.hThreads < 0 || argFlags.gThreads < 0) {
		ns.tprint("ERROR: number of threads shouldn't be negative");
		ns.exit();
	} else if (argFlags.hThreads == 0 && argFlags.gThreads == 0) {
		ns.tprint("ERROR: needs at least 1 of -h or -g number to calculate");
		ns.exit();
	}
	let sName = argFlags._[0];
	let weakenVal = 0.05; // TODO: grab this from somewhere? it's the default 1 core value. but unsure how it factors with bit-nodes

	if (argFlags.hThreads > 0) {
		let hackThreads = argFlags.hThreads; // TODO get this limit based on the hackAnalyzeSecurity max threads to hack 100% limit (or manually check)
		// get % hacked from argFlags.hThreads number of threads
		let percentToGrow = hackThreads * ns.hackAnalyze(sName);
		// get number of growth threads to compensate
		let growthThreads = Math.ceil(ns.growthAnalyze(sName, 1 + percentToGrow, argFlags.cores));
		// get total value needed to weaken from both hack and grow
		let toWeaken = ns.hackAnalyzeSecurity(hackThreads, sName) + ns.growthAnalyzeSecurity(growthThreads);
		// get threads by dividing by weakenVal (TODO can this be automated? not sure if 0.05 is ALWAYS the case)
		let weakenThreads = Math.ceil(toWeaken / weakenVal);
		let totalThreads = hackThreads + growthThreads + weakenThreads;
		let formatString = "%-13s:\t%3i\t(%3s)";
		ns.tprintf(formatString, "hackThreads", hackThreads, ns.nFormat(hackThreads / totalThreads,"0%"));
		ns.tprintf(formatString, "growthThreads", growthThreads, ns.nFormat(growthThreads / totalThreads,"0%"));
		ns.tprintf(formatString, "weakenThreads", weakenThreads, ns.nFormat(weakenThreads / totalThreads,"0%"));
	} else if (argFlags.gThreads > 0) {
		// TODO fill in what to do for a grow calculation
		ns.tprint(`weakenThreads:${ns.growthAnalyzeSecurity(argFlags.gThreads) / weakenVal}`);
	} else {
		// TODO fill in a default calculation?
	}
}