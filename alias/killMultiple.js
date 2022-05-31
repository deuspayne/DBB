/** @param {NS} ns */
export async function main(ns) {
	let flagArgs = ns.flags([['skip', false],]);
	flagArgs._.forEach(pid => {
		ns.print(`Killing [${pid}].`);
		if (!flagArgs.skip) ns.kill(pid);
	})
}