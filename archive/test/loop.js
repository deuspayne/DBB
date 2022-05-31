export function autocomplete(data, args) {
	return [...data.servers]; // This script autocompletes the list of servers.
}
/** @param {NS} ns */
export async function main(ns) {
	let myList = ns.args;
	while (true) {
		for (const idx in myList) {
			await ns.hack(myList[idx]);
			await ns.grow(myList[idx]);
			await ns.weaken(myList[idx]);
		}
	}
}