let argSchema = [
	['tail', false],
	['help', false],
	['h', false],
	['maxCost', -1],
	['getAugs', false],
	// ['once', false],
	// ['loopTime', 1],
	// ['exclude', []],
	// ['verbose', false],
]
export function autocomplete(data, args) {
	data.flags(argSchema);
	return [];
}
/** @param {NS} ns */
export async function main(ns) {
	let argFlags = ns.flags(argSchema);
	if (argFlags.help || argFlags.h) {
		ns.tprintf("INFO: TODO info about gangPulse.js");
		ns.tprintf("INFO: run gangPulse.js --loopTime 1 --once --tail");
		ns.exit();
	}

	for (const gmName of ns.gang.getMemberNames()) {
		for (const eName of ns.gang.getEquipmentNames()) {
			let eCost = ns.gang.getEquipmentCost(eName);
			let eType = ns.gang.getEquipmentType(eName);
			if ((argFlags.maxCost < 0 || eCost < argFlags.maxCost) && !(!argFlags.getAugs && eType == "Augmentation")) {
				ns.gang.purchaseEquipment(gmName, eName);
			}
		}
		// ns.tprint(ns.gang.getEquipmentNames());
	}
}