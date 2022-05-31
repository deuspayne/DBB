/** @param {NS} ns */
export async function main(ns) {
	switch (ns.args.length) {
		case 1:
			while (true) {
				await ns.hack(ns.args[0]);
				await ns.grow(ns.args[0]);
				await ns.hack(ns.args[0]);
				await ns.weaken(ns.args[0]);
			}
			break;
		default:
			ns.tprint("Unknown number of args. needs 1 for name of server");
	}
}