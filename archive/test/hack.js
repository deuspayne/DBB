export function autocomplete(data, _) { return [...data.servers]; }
/** @param {NS} ns */
export async function main(ns) {
	let sTime = (ns.args.length < 2) ? 5000 : ns.args[1];
	while (true) {
		await ns.sleep(sTime);
		await ns.hack(ns.args[0]);
	}
}