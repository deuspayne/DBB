export function autocomplete(data, args) {
	return [...data.servers]; // This script autocompletes the list of servers.
}
/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("sleep");
	ns.tail();
	let argFlag = ns.flags([['test', false]]);

	while (true) {
		let serverObject = ns.getServer(argFlag._[0]);
		let percent = serverObject.ramUsed / serverObject.maxRam;

		let maxBars = 20;
		let numBars = Math.round(percent * maxBars);
		ns.printf(`(%s) %s [%s%s] %7s`,
			new Date().toLocaleTimeString(),
			argFlag._[0],
			'|'.repeat(numBars),
			'.'.repeat(maxBars - numBars),
			ns.nFormat(percent, "0,0.00%")
		);

		await ns.sleep(1000);
	}
}