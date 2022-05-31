/** @param {NS} ns */
export async function main(ns) {
	// let sing = ns.singularity;
	for (const key in ns.singularity) {
		ns.tprint(key);
	}
}