import { buildServerList } from 'libHelpers.js';

let argSchema = [
    ['tail', false],
    ['script', 'smartHack.js'],
]
export function autocomplete(data, args) {
    data.flags(argSchema);
    return [...data.scripts];
}
/** @param {NS} ns */
export async function main(ns) {
    let argFlags = ns.flags(argSchema);
    let serverList = buildServerList(ns);
    for (const serverName of serverList) {
        let scriptList = ns.ps(serverName);
        for (const script of scriptList) {
            // ns.print(script.filename);
            // ns.print(argFlags.script);
            if (script.filename == argFlags.script) {
                ns.kill(script.pid);
            }
        }
    }
}