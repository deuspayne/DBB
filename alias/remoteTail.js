/** @param {NS} ns */
export async function main(ns) {
    ns.args.forEach(pid => { ns.tail(pid); });
}