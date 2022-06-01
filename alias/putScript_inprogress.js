import {
    buildFlags
} from 'libHelpers.js';

let argSchema = [
    ['help', false],
    ['h', false],
    ['tail', false],
    ['script', ''],
    ['s', ''],
    ['host', ''],
];

export function autocomplete(data, args) {
    data.flags(argSchema);
    const lastFlag = args.length >= 2 ? args[args.length - 2] : null;
    if (lastFlag == "--script" || lastFlag == "-s")
        return data.scripts;
    return [...data.servers];
}
/** @param {NS} ns */
export async function main(ns) {
    let argFlags = buildFlags(ns, argSchema);

    // TODO finish modifying below here!!!!!
    // TODO logic should be 1 script only, bail on both --script and -s being called
    // TODO everything should be flagged other than list of args new script should be launched with
    //    aka: argFlags._ should always be server args only
    let serverArgs = argFlags._;
    let scriptArgs = [];
    let scriptName = "";
    serverArgs.forEach((element, index) => {
        if (element.toString().match("s=")) {
            scriptArgs.push(...serverArgs.splice(index, 1));
        }
    })
    if (serverArgs.length === 0) {
        ns.tprint("ERROR: no server arguments found");
        ns.exit();
    }
    let serverName = serverArgs.shift(); // get first arg remaining for server name
    if (serverArgs.length === 0) serverArgs = [serverName]; // if only 1 server, it's the destination too

    if (scriptArgs.length === 0) { // if there is no script name, slice off the first 2 chars (s=)
        // scriptName = "weaken.js";
        scriptName = "smartHack.js"
    } else {
        scriptName = (scriptArgs[0]).slice(2);
        // TODO set a default if the post-slice is a problem
    }

    // puts the file on the server
    await ns.scp(scriptName, serverName);
    let serverObject = ns.getServer(serverName);
    let numThreads = Math.floor((serverObject.maxRam - serverObject.ramUsed) / ns.getScriptRam(scriptName, serverName));

    // TODO checks to make sure this should be done first
    if (numThreads > 0) ns.exec(scriptName, serverName, numThreads, ...serverArgs);
}