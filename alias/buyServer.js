let argSchema = [
	['help', false],
	['f', false],
	['force', false],
];
export function autocomplete(data, args) {
	let retArray = [];
	for (const ele of argSchema) {
		if (ele[0].length > 1)
			retArray.push("--" + ele[0]);
	}
	return [...retArray]
}
/** @param {NS} ns */
export async function main(ns) {
	let argFlags = ns.flags(argSchema);
	if (argFlags.help) {
		ns.tprint("INFO: --help"); // TODO fill out help
		ns.exit();
	}
	// if (ns.args.length != 1) ns.exit();
	if (argFlags._.length != 1 || isNaN(argFlags._[0])) {
		ns.tprint(`ERROR: unknown args: ${argFlags._}`);
		ns.exit();
	}
	// let size = ns.getPurchasedServerMaxRam();
	let size = Math.pow(2, argFlags._[0]);
	let cost = ns.getPurchasedServerCost(size);

	let promptStr = `Trying to purchase server with 2^${argFlags._[0]} GB Memory\n`;
	promptStr += ` max : ${ns.nFormat(ns.getPurchasedServerMaxRam(), "0,0 GB")}\n`;
	promptStr += ` size: ${ns.nFormat(size, "0,0 GB")}\n`;
	promptStr += ` cost: ${ns.nFormat(cost, "$ 0,0.00")}\n`;
	let doBool = true;
	if (!argFlags.f && !argFlags.force) {
		doBool = await ns.prompt(promptStr);
	}
	if (doBool) {
		let sName = ns.purchaseServer(`Deus${size}`, size);
		if (sName != null) {
			ns.tprintf(`Purchased: ${sName}`);
			ns.exec("/alias/scpf.js", "home", 1, ".", sName);
		} else {
			ns.tprintf(`ERROR: couldn't buy Deus${size} for some reason or another`);
		}
	}
	else ns.tprint(`No server purchased.`);
}