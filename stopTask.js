const argSchema = [
	['tail', false],
	['help', false],
	['h', false],
	['hours', 0],
	['minutes', 0],
	['seconds', 0],
];
export function autocomplete(data, args) {
	data.flags(argSchema);
	return [];
}
/** @param {NS} ns */
export async function main(ns) {
	let argFlags = {};
	try { argFlags = ns.flags(argSchema); }
	catch {
		ns.tprint("ERROR: Couldn't process flags schema. Likely invalid flag passed");
		ns.tprint(`ERROR: Flags:[${ns.args}]`);
		ns.exit();
	}
	if (argFlags.help || argFlags.h) {
		ns.tprint("INFO: run stopTask.js --tail --help/-h --hours 0 --minutes 0 --seconds 0");
		ns.exit();
	}
	ns.tail();
	let startTime = new Date();
	let sleepTime = (argFlags.seconds * 1000) + (argFlags.minutes * 1000 * 60) + (argFlags.hours * 1000 * 60 * 60);
	let endTime = new Date(startTime.getTime() + sleepTime);
	ns.print(`[${startTime.toLocaleTimeString()}] Stopping task at: ${endTime.toLocaleTimeString()}`);
	await ns.sleep(sleepTime);
	ns.singularity.stopAction();
}