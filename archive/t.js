/** @param {NS} ns */
export async function main(ns) {
	const irongym = ns.getServer("iron-gym");
	const ip = ns.getServer("61.7.8.3");
	const defcomm = ns.getServer("defcomm");
	console.log(irongym);
	console.log(ip);
	console.log(defcomm);
	ns.tprint(irongym);
	ns.tprint(ip);
	ns.tprint(defcomm);
}