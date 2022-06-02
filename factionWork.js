const argSchema = [
    ['tail', false],
    ['help', false],
    ['h', false],
    ['once', false],
    ['faction', 'Sector-12'],
    ['work', 'Hacking Contracts']
];
export function autocomplete(data, args) {
    data.flags(argSchema);
    return [`"Hacking Contracts"`, `"Field Work"`, `"Security Work"`];
}
/** @param {NS} ns */
export async function main(ns) {
    let argFlags = ns.flags(argSchema);
    if (argFlags.help || argFlags.h) {
        ns.tprint(`INFO: factionWork.js --help -h --faction "Sector-12" --work "Hacking Contracts"`);
        // ns.tprint(`INFO: ${JSON.stringify(cList)}`);
        ns.exit();
    }
    ns.disableLog("sleep");
    do { // Main body loop
        ns.tail();
        if (!ns.singularity.isBusy()) {
            ns.singularity.workForFaction(argFlags.faction, argFlags.work);
            if (argFlags.once) ns.exit();
        }
        await ns.sleep(1000);
    } while (true);

}