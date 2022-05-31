export function autocomplete(data, args) {
	// data
}

/** @param {NS} ns */
export async function main(ns) {
	ns.tail();
	while(true) {
		// let portVal = ns.readPort(100);
		ns.print(ns.readPort(1));
		await ns.sleep(1000);
	}
}