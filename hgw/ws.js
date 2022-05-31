export function autocomplete(data, _) { return [...data.servers]; }
/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length < 2) ns.exit();
	await ns.sleep(ns.args[0]); // sleep for first arg
	await ns.weaken(ns.args[1]); // grow second arg
}