import { buildServerList } from '/lib/helpers.js';

export function autocomplete(data, _) {
	return ["--asdf"];
}

let confSchema = [
	['asdf', false],

];
/** @param {NS} ns */
export async function main(ns) {
	let confFlags = ns.flags(confSchema); 
	// if (confFlags.tail) ns.tail();
	let lastPid = 0;
	let sList = (confFlags.here) ? [ns.getHostname()] : buildServerList(ns);
	sList.forEach(sName => {
		ns.ps(sName).forEach(pObj => {
			if (pObj.filename != ns.getScriptName())
				lastPid = Math.max(lastPid, pObj.pid);
		})
	})
	ns.tprint(`${lastPid} is highest pid found, tailing`);
	ns.tail(lastPid);
}