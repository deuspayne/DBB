// ns.getDivision seems to just return a subset of getCorporation... why bother?
let argSchema = [
	['tail', false],
	['help', false],
	['h', false],
];
export function autocomplete(data, args) {
	data.flags(argSchema);
	return [];
}
/** @param {NS} ns */
export async function main(ns) {
	let argFlags = ns.flags(argSchema);
	if (argFlags.h || argFlags.help) {
		ns.tprint("INFO: TODO info about corpHire.js");
		ns.tprint("INFO:  run corpHire.js --tail --help -h");
		ns.exit();
	}

	// Main Logic of program
	do {
		let cInfo = ns.corporation.getCorporation();
		// ns.tprint(cInfo);
		for (const division of cInfo.divisions) {
			for (const cName of division.cities) {
				let oInfo = ns.corporation.getOffice(division.name, cName);
				oInfo.employeeJobs.RandD = oInfo.employeeJobs["Research & Development"]; // swap out key with spaces for more easily accesible key
				delete (oInfo.employeeJobs["Research & Development"]);
				let freeJobs = oInfo.size -
					oInfo.employeeJobs.Business -
					oInfo.employeeJobs.Engineer -
					oInfo.employeeJobs.Management -
					oInfo.employeeJobs.Operations -
					oInfo.employeeJobs.RandD -
					oInfo.employeeJobs.Training -
					oInfo.employeeJobs.Unassigned
				for (let i = 0; i < freeJobs; i++) { // if free jobs, hire people
					ns.tprint(`Buying for ${division.name} in ${cName}`);
					ns.corporation.hireEmployee(division.name, cName);
				}
				// remove jobs we don't care about for reduce purposes
				// let unassigned = oInfo.employeeJobs.Unassigned;
				// delete (oInfo.employeeJobs.Unassigned);
				// delete (oInfo.employeeJobs.Training);
				// for (let i = 0; i < unassigned; i++) {
				// for (const eName of oInfo.employees) {
				// 	if (ns.corporation.getEmployee(division.name, cName, eName).pos == "Unassigned") {
				// 		let minKey = Object.keys(oInfo.employeeJobs).reduce((key, v) => oInfo.employeeJobs[v] < oInfo.employeeJobs[key] ? v : key);
				// 		ns.tprint(`${division.name} in ${cName}: lowest jobs: ${minKey}\t unassigned: ${unassigned}`);
				// 		await ns.corporation.assignJob(division.name, cName, eName, minKey);
				// 	}
				// }
				// }
				// TODO check and see if there's anyone Unassigned or in Training that need to be assigned to a roll that is actually useful.
			}
		}
		// ns.corporation.hireEmployee("DeusTobacco","Volhaven");
	} while (false) // for use if a daemon is needed, can be short circuited with an argFlags.once style flag
}