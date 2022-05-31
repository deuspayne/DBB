/** @param {NS} ns */
export async function main(ns) {
	let pids = {};
	pids.kar = ns.exec("crimeMonitor.js", "home", 1, "--stat", "Karma");
	pids.cha = ns.exec("crimeMonitor.js", "home", 1, "--stat", "Charisma");
	pids.agi = ns.exec("crimeMonitor.js", "home", 1, "--stat", "Agility");
	pids.dex = ns.exec("crimeMonitor.js", "home", 1, "--stat", "Dexterity");
	pids.def = ns.exec("crimeMonitor.js", "home", 1, "--stat", "Defense");
	pids.str = ns.exec("crimeMonitor.js", "home", 1, "--stat", "Strength");
	pids.hac = ns.exec("crimeMonitor.js", "home", 1, "--stat", "Hacking");
	pids.mon = ns.exec("crimeMonitor.js", "home", 1, "--stat", "Money", "--minPercent", 50);
	ns.exec("karmaMonitor.js", "home", 1);

	for (const key in pids) {
		ns.tail(pids[key]);
		ns.kill(pids[key]);
	}
}