const argSchema = [
	['tail', false],
	['help', false],
	['h', false],
	['once', false],
	['crime', 'Shoplift'],
	['stat', 'Dexterity'],
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
	return ["Hacking", "Strength", "Defense", "Dexteriy", "Agility", "Charisma", "Money",];
}
/** @param {NS} ns */
export async function main(ns) {
	let argFlags = ns.flags(argSchema);
	if (argFlags.help || argFlags.h) {
		ns.tprint(`INFO: crimeMonitor.js --help -h --once --crime "Shoplift"`);
		ns.tprint(`INFO: ${JSON.stringify(cList)}`);
		ns.exit();
	}
	ns.disableLog("sleep");
	do { // Main body loop
		ns.clearLog();
		ns.tail(); // to allow for manual killing of script, even if tail is closed, it'll open next loop
		for (const cHash of cList) {
			let cStat = ns.singularity.getCrimeStats(cHash.name);
			let cChance = ns.singularity.getCrimeChance(cHash.name);
			// for (const key in cStat) {
			// 	ns.print(`${key}: ${cStat[key]}`);
			// }
			// ns.print(`chance: ${ns.nFormat(cChance, "0.0%")}`);
			cHash.perSecond = {};
			cHash.perSecond.Hacking = 1000 * cChance * cStat.hacking_exp / cStat.time;
			cHash.perSecond.Strength = 1000 * cChance * cStat.strength_exp / cStat.time;
			cHash.perSecond.Defense = 1000 * cChance * cStat.defense_exp / cStat.time;
			cHash.perSecond.Dexteriy = 1000 * cChance * cStat.dexterity_exp / cStat.time;
			cHash.perSecond.Agility = 1000 * cChance * cStat.agility_exp / cStat.time;
			cHash.perSecond.Charisma = 1000 * cChance * cStat.charisma_exp / cStat.time;
			cHash.perSecond.Money = 1000 * cChance * cStat.money / cStat.time;

		}

		// Find Maxes
		let maxStats = {
			Hacking: { crime: "", value: 0 },
			Strength: { crime: "", value: 0 },
			Defense: { crime: "", value: 0 },
			Dexteriy: { crime: "", value: 0 },
			Agility: { crime: "", value: 0 },
			Charisma: { crime: "", value: 0 },
			Money: { crime: "", value: 0 },
		};
		for (const cData of cList) {
			for (const key in maxStats) {
				if (cData.perSecond[key] > maxStats[key].value) {
					maxStats[key].value = cData.perSecond[key];
					maxStats[key].crime = cData.name;
				}
			}
		}
		// ns.print(`Hac: ${jHac}: ${mHac}`);
		// ns.print(`Str: ${jStr}: ${mStr}`);
		// ns.print(`Def: ${jDef}: ${mDef}`);
		// ns.print(`Dex: ${jDex}: ${mDex}`);
		// ns.print(`Agi: ${jAgi}: ${mAgi}`);
		// ns.print(`Cha: ${jCha}: ${mCha}`);
		ns.print(JSON.stringify(maxStats));
		//  print processed table
		// for (const cData of cList) { // for loop over processed list
		// 	ns.print(JSON.stringify(cData));

		// 	// let formatString = "|%6s|%6s|%6s|%6s|%6s|%6s|";
		// 	// ns.printf(formatString, "------", "------", "------", "------", "------", "------");
		// 	// ns.printf(formatString, "hack/s", " str/s", " def/s", " dex/s", " agi/s", " cha/s");
		// 	// ns.printf(formatString, "------", "------", "------", "------", "------", "------");
		// 	// ns.printf(formatString,
		// 	// 	ns.nFormat(haps, "0,0.0"),
		// 	// 	ns.nFormat(stps, "0,0.0"),
		// 	// 	ns.nFormat(dfps, "0,0.0"),
		// 	// 	ns.nFormat(dxps, "0,0.0"),
		// 	// 	ns.nFormat(agps, "0,0.0"),
		// 	// 	ns.nFormat(chps, "0,0.0"),
		// 	// );
		// 	// ns.printf(formatString,
		// 	// 	ns.nFormat(haps * cChance, "0,0.0"),
		// 	// 	ns.nFormat(stps * cChance, "0,0.0"),
		// 	// 	ns.nFormat(dfps * cChance, "0,0.0"),
		// 	// 	ns.nFormat(dxps * cChance, "0,0.0"),
		// 	// 	ns.nFormat(agps * cChance, "0,0.0"),
		// 	// 	ns.nFormat(chps * cChance, "0,0.0"),
		// 	// );
		// 	// ns.print(`-------------------------------------------`);
		// }

		// if (!ns.singularity.isBusy()) ns.singularity.commitCrime(argFlags.crime);
		await ns.sleep(1000);
	} while (!argFlags.once);
}