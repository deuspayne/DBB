export function autocomplete(data, args) {
	return [...data.servers, ...data.scripts]; // This script autocompletes the list of servers.
}
/** @param {NS} ns */
export async function main(ns) {
	// TODO put check to make sure it has 2 and only 2 arguments

	let sourceName = ns.getHostname();
	let folder = ns.args[0];
	let destName = ns.args[1];
	let files = ns.ls(sourceName, folder);
	let scpFiles = [];

	files.forEach(file => {
		ns.print(file);
		if (file.endsWith(".js") || file.endsWith(".script") || file.endsWith(".txt") || file.endsWith(".lit"))
			scpFiles.push(file);
	})

	ns.scp(scpFiles, destName);
}