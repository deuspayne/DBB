let argSchema = [
    ['help', false],
    ['tail', false],
    ['percent', 20],
    ['cores', 1], // TODO: pull cores from host being checked
];
export function autocomplete(data, args) {
    data.flags(argSchema); // adds flags to autocomplete
    return [...data.servers];
}

/** @param {NS} ns */
export async function main(ns) {
    let argFlags = ns.flags(argSchema);
    if (argFlags.help) {
        ns.tprint("INFO: threadAnalyzer --help");
        ns.tprint("TODO: INFO ABOUT threadAnalyzer");
        ns.tprint("threadAnalyzer --percent # ");
        ns.exit();
    }
    let sName = argFlags._[0];
    let weakenVal = 0.05; // TODO: grab this from somewhere? it's the default 1 core value. but unsure how it factors with bit-nodes
    let hPct = argFlags.percent / 100;
    ns.tprintf("Running threadAnalyzer on %s for (%s) amount of the value",
        sName,
        ns.nFormat(hPct, "0%"),
    );
    // get number of hack threads to get hPct of the server (sName)
    let hackThreads = hPct / ns.hackAnalyze(sName);
    // get % hacked from hackThreads number of threads
    let percentToGrow = hackThreads * ns.hackAnalyze(sName);
    // TODO adjust percentToGrow to be a dollar value, then get a new percent based on new available money
    // get number of growth threads to compensate
    let growthThreads = Math.ceil(ns.growthAnalyze(sName, 1 + percentToGrow, argFlags.cores));
    // get total value needed to weaken from both hack and grow
    let toWeaken = ns.hackAnalyzeSecurity(hackThreads, sName) + ns.growthAnalyzeSecurity(growthThreads);
    // get threads by dividing by weakenVal (TODO can this be automated? not sure if 0.05 is ALWAYS the case)
    let weakenThreads = Math.ceil(toWeaken / weakenVal);
    let totalThreads = hackThreads + growthThreads + weakenThreads;
    let formatString = "%-13s:\t%3i\t(%3s)";
    ns.tprintf(formatString, "hackThreads", hackThreads, ns.nFormat(hackThreads / totalThreads, "0.0%"));
    ns.tprintf(formatString, "growthThreads", growthThreads, ns.nFormat(growthThreads / totalThreads, "0.0%"));
    ns.tprintf(formatString, "weakenThreads", weakenThreads, ns.nFormat(weakenThreads / totalThreads, "0.0%"));
    ns.tprintf(formatString, "totalThreads", totalThreads, ns.nFormat(1, "0.0%"));

}