import { buildServerList } from '/lib/helpers.js';

export function autocomplete(data, args) {
    return [...data.servers, ...data.scripts];
}
/** @param {NS} ns */
export async function main(ns) {
    let grepStr = ns.args[0] || null;
    let sortStr = "pid";
    let hostJSON = { "home": { "depth": 0, "parent": null, "backdoor": false } };
    let maxDepth = 20;
    buildHostList();
    let serverList = Object.keys(hostJSON).sort();

    let allScripts = [];
    serverList.forEach(serverName => {
        let processList = ns.ps(serverName);
        processList.forEach(process => {
            process.server = serverName;
            if (grepStr === null || serverName === grepStr || process.filename === grepStr)
                allScripts.push(process);
            else {
                process.args.some(arg => {
                    let comparison = (grepStr === null || arg === grepStr);
                    if (comparison) allScripts.push(process);
                    return comparison;

                })
            }

        })
    })

    allScripts.sort((a, b) => { return a[sortStr] - b[sortStr]; }) // sort by sortStr
    if (sortStr == "pid") allScripts.pop(); // remove the last one, it's this script. no need to include it in the list // TODO this may need to change
    let formatStr = "(%s)\t[%7s] %18s: %-20s\t[%s]";
    ns.tprintf(formatStr,
        "pid",
        "threads",
        "host",
        "script",
        "args",
    );
    ns.tprintf(formatStr,
        "---",
        "-------",
        "--------",
        "----------",
        "----",
    );
    allScripts.forEach(scriptProcess => {
        // ns.tprintf("%s", JSON.stringify(scriptProcess));
        ns.tprintf(formatStr,
            scriptProcess.pid,
            scriptProcess.threads,
            scriptProcess.server,
            scriptProcess.filename,
            scriptProcess.args,
        );
    })
    ns.tprintf("%s scripts.", allScripts.length);

    function buildHostList() {
        buildHostHelper("home", 1);
    }

    function buildHostHelper(hostName, depth) {
        if (depth > maxDepth) return;
        let newList = ns.scan(hostName);
        newList.forEach(childName => {
            let hashKeys = Object.keys(hostJSON);
            if (!hashKeys.includes(childName)) { // host isn't in list
                let childObject = ns.getServer(childName);
                hostJSON[childName] = {
                    "depth": depth,
                    "parent": hostName,
                    "backdoor": childObject.backdoorInstalled,
                    "hackDifficulty": Math.round(childObject.hackDifficulty),
                };
                buildHostHelper(childName, depth + 1);
            }
        })
    }
}