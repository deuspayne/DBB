let argSchema = [
	['tail', false],
	['help', false],
	['tLimit', 50],
	['runHost', 'home'],
	['hPct', 10],
	['gPct', 80],
	['wPct', 10],
];
export function autocomplete(data, args) {
	data.flags(argSchema); // TODO this auto adds all flags to the autocomplete. (in addition to the returned array)
	return [...data.servers]
}
/** @param {NS} ns */
export async function main(ns) {
	let argFlags = ns.flags(argSchema);
	if (argFlags.help) {
		// TODO print help text
		ns.tprintf("batchHack.js HELP GOES HERE.");
		ns.tprintf("batchHack --tLimit 400 --hPct 15 --gPct 77 --wPct 8 --runHost home --tail <targetHost>");
		ns.exit();
	}
	let targetHost = argFlags._[0]; // TODO check to make sure argument is passed
	let hPct = argFlags.hPct / 100;
	let gPct = argFlags.gPct / 100;
	let wPct = argFlags.wPct / 100;
	if (argFlags.hPct + argFlags.gPct + argFlags.wPct != 100) {
		ns.tprint(`ERROR: percents do not add up to 100% (${argFlags.hPct + argFlags.gPct + argFlags.wPct})`);
		ns.exit();
	}
	let hFile = "/hgw/h.js";
	let gFile = "/hgw/g.js"; // TODO put sleep versions of one off hgw's
	let wFile = "/hgw/w.js";

	let tLimitAdjusted = argFlags.tLimit;
	let hThreads = tLimitAdjusted * hPct;
	let gThreads = tLimitAdjusted * gPct;
	let wThreads = tLimitAdjusted * wPct;
	while (true) {
		await ns.scp(hFile, argFlags.runHost);
		await ns.scp(gFile, argFlags.runHost);
		await ns.scp(wFile, argFlags.runHost);
		let hPid = ns.exec(hFile, argFlags.runHost, hThreads, targetHost); // TODO put in wait times from between scripts
		let gPid = ns.exec(gFile, argFlags.runHost, gThreads, targetHost); // TODO and expected end time
		let wPid = ns.exec(wFile, argFlags.runHost, wThreads, targetHost);
		let sleepBuffer = 1000;
		let sleepTime = ns.getWeakenTime(targetHost);
		if (hPid == 0 || gPid == 0 || wPid == 0) { // if any of them didn't spawn, kill all and wait 10 seconds
			ns.print("ERROR: didn't launch the batch, killing the whole batch and waiting 10 seconds");
			sleepTime = 9000; // wait 9 (+1 buffer) seconds
			if (hPid != 0) ns.kill(hPid);
			if (gPid != 0) ns.kill(gPid);
			if (wPid != 0) ns.kill(gPid);
		}
		ns.print(`Sleeping for ${ns.tFormat(sleepTime + sleepBuffer)}`) // TODO: put expected loop finish in here
		await ns.sleep(sleepTime + sleepBuffer); // wait 1 second longer than weaken time (which so far is the longest time)
	}
}