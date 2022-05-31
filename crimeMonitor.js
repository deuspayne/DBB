const argSchema = [
	['tail', false],
	['help', false],
	['h', false],
	['once', false],
	// ['crime', 'Shoplift'],
	['stat', 'Dexterity'],
	['minPercent', 5],
];
let cList = [
	{ "name": "Shoplift" },
	{ "name": "Rob Store" },
	{ "name": "Mug Someone" },
	{ "name": "Larceny" },
	{ "name": "Deal Drugs" },
	{ "name": "Bond Forgery" },
	{ "name": "Traffick Illegal Arms" },
	{ "name": "Homicide" },
	{ "name": "Grand Theft Auto" },
	{ "name": "Kidnap and Ransom" },
	{ "name": "Assassinate" },
	{ "name": "Heist" },
];
export function autocomplete(data, args) {
	data.flags(argSchema);
	// TODO stuff here to do a last flag check for --stat and return stat list type then only
	return ["Hacking", "Strength", "Defense", "Dexterity", "Agility", "Charisma", "Money", "Karma", "Kills",];
}
/** @param {NS} ns */
export async function main(ns) {
	let argFlags = ns.flags(argSchema);
	if (argFlags.help || argFlags.h) {
		ns.tprint(`INFO: crimeMonitor.js --help -h --once --stat Dexterity`);
		ns.tprint(`INFO: ${JSON.stringify(cList)}`);
		ns.exit();
	}
	ns.disableLog("sleep");
	ns.clearLog();
	// ns.exec("/alias/killSmartHack.js", "home", 1, "--script", "crimeMonitor.js"); // make sure no other are running
	do { // Main body loop
		ns.tail(); // to allow for manual killing of script, even if tail is closed, it'll open next loop
		for (const cHash of cList) {
			let cStat = ns.singularity.getCrimeStats(cHash.name);
			let cChance = ns.singularity.getCrimeChance(cHash.name);
			cHash.perSecond = {};
			cHash.perSecond.Hacking = 1000 * cChance * cStat.hacking_exp / cStat.time;
			cHash.perSecond.Strength = 1000 * cChance * cStat.strength_exp / cStat.time;
			cHash.perSecond.Defense = 1000 * cChance * cStat.defense_exp / cStat.time;
			cHash.perSecond.Dexterity = 1000 * cChance * cStat.dexterity_exp / cStat.time;
			cHash.perSecond.Agility = 1000 * cChance * cStat.agility_exp / cStat.time;
			cHash.perSecond.Charisma = 1000 * cChance * cStat.charisma_exp / cStat.time;
			cHash.perSecond.Money = 1000 * cChance * cStat.money / cStat.time;
			cHash.perSecond.Karma = 1000 * cChance * cStat.karma / cStat.time;
			cHash.perSecond.Kills = 1000 * cChance * cStat.kills / cStat.time;
			cHash.cChance = cChance;


		}

		// Find Maxes
		let maxStats = {
			Hacking: { crime: "", value: 0 },
			Strength: { crime: "", value: 0 },
			Defense: { crime: "", value: 0 },
			Dexterity: { crime: "", value: 0 },
			Agility: { crime: "", value: 0 },
			Charisma: { crime: "", value: 0 },
			Money: { crime: "", value: 0 },
			Karma: { crime: "", value: 0 },
			Kills: { crime: "", value: 0 },
		};
		for (const cData of cList) {
			for (const key in maxStats) {
				if (cData.perSecond[key] >= maxStats[key].value && cData.cChance >= argFlags.minPercent / 100) {
					maxStats[key].value = cData.perSecond[key];
					maxStats[key].crime = cData.name;
				}
			}
		}
		// ns.print(JSON.stringify(maxStats));
		if (!ns.singularity.isBusy()) ns.singularity.commitCrime(maxStats[argFlags.stat].crime);
		if ((!argFlags.once)) await ns.sleep(1000);
	} while (!argFlags.once);
}