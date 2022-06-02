export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
}
/** @param {NS} ns */
export async function main(ns) {
    let serverList = [
        "crush-fitness",
        "silver-helix",
        "omega-net",
        "iron-gym",
    ];
    if (ns.args.length > 0) {
        serverList = ns.args;
    }
    while (true) {
        for (const key in serverList) {
            let serverName = serverList[key];
            await ns.weaken(serverName);
            await ns.grow(serverName);
        }
    }
}