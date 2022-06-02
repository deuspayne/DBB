import { buildServerList } from 'libHelpers.js';
/** @param {NS} ns */
export async function main(ns) {
	let hostList = buildServerList(ns);
	for (const hostName of hostList) {
		let scriptList = ns.ps(hostName);
		for (const script of scriptList) {
			if (script.filename === "autoGrow.old.js") {
				ns.kill(script.pid);
			}
		}
	}
}