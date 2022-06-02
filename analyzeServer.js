export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
}
/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length != 1) ns.exit();

    let serverObject = ns.getServer(ns.args[0]);

    for (const key in serverObject) {
        ns.tprint(`${key}: ${serverObject[key]}`);
    }
}