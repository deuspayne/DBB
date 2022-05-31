/** @param {NS} ns */
export async function main(ns) {
	let numArgs = ns.args.length;
	switch (numArgs) {
		case 0:
			alert("case 0");
			break;
		case 1:
			let serverName = ns.args[0];
			let serverObject = await ns.getServer(serverName);
			ns.tprint(serverName + " hasAdminRights:\t" + serverObject.hasAdminRights);
			ns.tprint("$" + Math.round(serverObject.moneyAvailable) + " of $" + serverObject.moneyMax + " max.")
			ns.tprint(serverObject.minDifficulty + " : " + serverObject.baseDifficulty + " : " +  serverObject.hackDifficulty);
			break;
		default:
			alert("default case");
			break;
	}
}