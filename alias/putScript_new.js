export function autocomplete(data, args) {
// TODO proper flagging.
    // data.flags(argsSchema);
    // const lastFlag = args.length > 1 ? args[args.length - 2] : null;
    // if (lastFlag == "--disable-script" || lastFlag == "--run-script")
    //     return data.scripts;
    // return [];

	let scripts = [];
	data.scripts.forEach(element => {
		scripts.push("s=" + element);
	})
	return [...scripts, ...data.servers]; // This script autocompletes the list of servers.
}
/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length === 0) { // if no arguments, exit with error
		ns.tprint("ERROR: needs argument(s)");
		ns.exit();
	}
	let serverArgs = ns.args;
	let scriptArgs = [];
	let scriptName = "";
	serverArgs.forEach((element, index) => {
		if (element.toString().match("s=")) {
			scriptArgs.push(...serverArgs.splice(index, 1));
		}
	})
	if (serverArgs.length === 0) {
		ns.tprint("ERROR: no server arguments found");
		ns.exit();
	}
	let serverName = serverArgs.shift(); // get first arg remaining for server name
	if (serverArgs.length === 0) serverArgs = [serverName]; // if only 1 server, it's the destination too

	if (scriptArgs.length === 0) { // if there is no script name, slice off the first 2 chars (s=)
		// scriptName = "weaken.js";
		scriptName = "smartHack.js"
	} else {
		scriptName = (scriptArgs[0]).slice(2);
		// TODO set a default if the post-slice is a problem
	}

	// puts the file on the server
	await ns.scp(scriptName, serverName);
	let serverObject = ns.getServer(serverName);
	let numThreads = Math.floor((serverObject.maxRam - serverObject.ramUsed) / ns.getScriptRam(scriptName, serverName));

	// TODO checks to make sure this should be done first
	if (numThreads > 0) ns.exec(scriptName, serverName, numThreads, ...serverArgs);
}