const argSchema = [
	['tail', false],
	['help', false],
	['h', false],
	['verbose', false],
	['crime', 'Mug Someone'],
];
const cList = [
	`"Shoplift"`,
	`"Rob Store"`,
	`"Mug Someone"`,
	`"Larceny"`,
	`"Deal Drugs"`,
	`"Bond Forgery"`,
	`"Traffick Illegal Arms"`,
	`"Homicide"`,
	`"Grand Theft Auto"`,
	`"Kidnap and Ransom"`,
	`"Assassinate"`,
	`"Heist"`,
];
export function autocomplete(data, args) {
	data.flags(argSchema);
	return [...cList];
}
/** @param {NS} ns */
export async function main(ns) {
	let argFlags = ns.flags(argSchema);
	if (argFlags.help || argFlags.h) {
		ns.tprint(`INFO: crime.js --tail --help -h --verbose --crime "Mug Someone"`);
		ns.tprint(`INFO:${cList}`);
		ns.exit();
	}
	ns.disableLog("sleep");
	ns.tail(); // to allow for manual killing of script
	do {
		if (!ns.singularity.isBusy()) {
			ns.singularity.commitCrime(argFlags.crime);
		}
		await ns.sleep(1000);
	} while (true);
}