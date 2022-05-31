let argSchema = [
	['tail', false],
	['help', false],
	['h', false],
	['once', false],
	['loopTime', 2.5], // minutes
	['exclude', []],
	['hackGang', false],
	// ['verbose', false],
]
export function autocomplete(data, args) {
	data.flags(argSchema);
	return [];
}
/** @param {NS} ns */
export async function main(ns) {
	let argFlags = ns.flags(argSchema);
	if (argFlags.help || argFlags.h) {
		ns.tprintf("INFO: TODO info about gangPulse.js");
		ns.tprintf("INFO: run gangPulse.js --loopTime 1 --once --tail");
		ns.exit();
	}
	let taskSwap1 = (argFlags.hackGang) ? "Train Hacking" : "Train Combat";
	let taskSwap2 = "Territory Warfare";
	do {
		for (const gmName of ns.gang.getMemberNames()) {
			if (!argFlags.exclude.includes(gmName)) {
				let gmInfo = ns.gang.getMemberInformation(gmName);
				if (gmInfo.task == taskSwap1) {
					ns.gang.setMemberTask(gmName, taskSwap2);
				} else if (gmInfo.task == taskSwap2) {
					ns.gang.setMemberTask(gmName, taskSwap1);
				}
			}
		}
		if (!argFlags.once) await ns.sleep(argFlags.loopTime * 60 * 1000);
	} while (!argFlags.once);
}