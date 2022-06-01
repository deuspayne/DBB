// TODO see if there's a way to put in percent discount
let argSchema = [
	['tail', false],
	['help', false],
	['once', false],
	['verbose', false],
	['v', false],
	['noTerritory', false],
];
export function autocomplete(data, args) {
	data.flags(argSchema); // adds --flags to autocomplete
	return [];
}
/** @param {NS} ns */
export async function main(ns) {
	let argFlags = ns.flags(argSchema);
	if (argFlags.help) {
		ns.tprintf("INFO: gangMonitor.js --help");
		ns.tprintf("INFO: TODO: gangMonitor --tail --help --once --verbose -v --noTerritory");
		ns.exit();
	}
	let fVerbose = argFlags.verbose || argFlags.v;
	ns.tail();
	ns.disableLog("sleep");

	do {
		ns.clearLog();
		/// GANG info
		let gObj = ns.gang.getGangInformation();
		ns.printf("%s: %s (%s)\tEarnings: %s",
			gObj.faction,
			ns.nFormat(gObj.respect, "0.000a"),
			ns.nFormat(gObj.respectGainRate, "+0,0"),
			ns.nFormat(gObj.moneyGainRate, "+$0.00a"), // TODO figure out why this is 5x less than the $/s listed on gang page
		);
		ns.printf("Wanted: %s (%s)\tPenalty: %s",
			ns.nFormat(gObj.wantedLevel, "0,0.00"),
			ns.nFormat(gObj.wantedLevelGainRate, "+0,0.00"),
			ns.nFormat(1 - gObj.wantedPenalty, "0,0.00%"),
		);
		ns.printf("-----------------------------------------------------------------");
		if (!argFlags.noTerritory) {
			/// OTHER GANG info
			ns.printf("Territory: %s\tPower: %s\tClash Chance: %s",
				ns.nFormat(gObj.territory, "0,0.00%"),
				ns.nFormat(gObj.power, "0,0"),
				ns.nFormat(gObj.territoryClashChance, "0,0.00%"),
			);
			let otherGangs = ns.gang.getOtherGangInformation();
			for (const ogName in otherGangs) {
				if (otherGangs[ogName].territory > 0 && ogName != gObj.faction) { // filter out our clan, and any clans that have no territory left
					ns.printf("%21s (%3s): %s [%s win chance]",
						ogName,
						ns.nFormat(otherGangs[ogName].territory, "0%"),
						ns.nFormat(otherGangs[ogName].power, "0,0"),
						ns.nFormat(ns.gang.getChanceToWinClash(ogName), "0%"),
					);
				}
			}
			ns.printf("-----------------------------------------------------------------");
		}
		// ns.gang.getChanceToWinClash
		/// GANG MEMBER info
		for (const gmName of ns.gang.getMemberNames()) {
			let gMember = ns.gang.getMemberInformation(gmName);
			let gAscRes = ns.gang.getAscensionResult(gmName);
			if (gAscRes == null) gAscRes = { hack: 0, str: 0, def: 0, dex: 0, agi: 0, cha: 0 }; // if not available to ascend, populate a bunch of default vals
			// TODO change the logic, so that verbose shows both hack and combat-avg. and without, just shows specific type for gang
			if (gObj.isHacking) { // Hacking Gang check
				// hacking stats
				ns.printf("%-4s %-22s %6s %8s %5s %8s  G: %s  A: %s",
					gMember.name,
					gMember.task,
					ns.nFormat(gMember.hack, "0.0a"),
					`(${ns.nFormat(gMember.hack_asc_mult, "0,0.0")}x)`,
					`x${ns.nFormat(gAscRes.hack, "0,0.0")}`,
					`[${ns.nFormat(gMember.hack_asc_mult * gAscRes.hack, "0,0.0")}x]`,
					gMember.upgrades.length,
					gMember.augmentations.length,
				);
			} else { // Not hacking gang, so must be combat
				// combat stats
				if (fVerbose) {
					ns.printf("%-4s %16s\t%5s/%5s/%5s/%5s\t(%5s/%5s/%5s/%5s)\t[%4s/%4s/%4s/%4s]\tGear: %s\tAugs: %s",
						gMember.name,
						gMember.task,
						gMember.str,
						gMember.def,
						gMember.dex,
						gMember.agi,
						ns.nFormat(gMember.str_asc_mult, "0,0.0"),
						ns.nFormat(gMember.def_asc_mult, "0,0.0"),
						ns.nFormat(gMember.dex_asc_mult, "0,0.0"),
						ns.nFormat(gMember.agi_asc_mult, "0,0.0"),
						ns.nFormat(gAscRes.str, "0,0.0"),
						ns.nFormat(gAscRes.def, "0,0.0"),
						ns.nFormat(gAscRes.dex, "0,0.0"),
						ns.nFormat(gAscRes.agi, "0,0.0"),
						gMember.upgrades.length,
						gMember.augmentations.length,
					);
				} else {
					// average of combat stats
					ns.printf("%-4s %21s\t%7s (%5sx) [%4sx] Gear: %2s Augs: %s",
						gMember.name,
						gMember.task,
						ns.nFormat((gMember.str + gMember.def + gMember.dex + gMember.agi) / 4, "0,0"),
						ns.nFormat((gMember.str_asc_mult + gMember.def_asc_mult + gMember.dex_asc_mult + gMember.agi_asc_mult) / 4, "0,0.0"),
						ns.nFormat((gAscRes.str + gAscRes.def + gAscRes.dex + gAscRes.agi) / 4, "0,0.0"),
						gMember.upgrades.length,
						gMember.augmentations.length,
					);
				}
			}
		}
		if (!argFlags.once) await ns.sleep(2000);
	} while (!argFlags.once);
}