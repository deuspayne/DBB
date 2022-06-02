export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
}
/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length != 1) {
        ns.tprint("ERROR: missing argument");
        ns.exit();
    }

    // initialize variables
    let hostToFind = ns.args[0];
    let hostJSON = { "home": { "depth": 0, "parent": null } };
    let maxDepth = 20; // hard limit, shouldn't be any hops over 15. set to 20 to see if problems occur

    // build list of all servers
    scanHost("home", 1); // builds hostJSON variable from all found servers

    // TOTO Check and make sure hostToFind is an actual host
    let path = `connect ${hostToFind}`;
    let bdi = ns.getServer(hostToFind).backdoorInstalled;
    if (!bdi) path = buildPath(hostToFind, path);
    ns.tprintf("%s", path);

    /** builds the host list from passed hostName and new depth of scan
     * @param hostName The name of new Host to scan
     * @param depth The Depth of the new Host being scanned
     */
    function scanHost(hostName, depth) {
        if (depth > maxDepth) return; // if we've hit the maxDepth check, bail (shouldn't be needed, but better than hanging the game)
        let newList = ns.scan(hostName);
        newList.forEach(childName => { // LOOP over each child of the scanned server
            let hashKeys = Object.keys(hostJSON);
            if (!hashKeys.includes(childName)) { // host isn't in list, add and process
                hostJSON[childName] = {
                    "depth": depth,
                    "parent": hostName,
                    "backdoor": ns.getServer(childName).backdoorInstalled,
                };
                scanHost(childName, depth + 1); // recursively build the tree map
            }
        })
    }
    /** builds the host list from passed hostName and new depth of scan
     * @param hostName The name of new Host to scan
     * @param currPath The current path to build upon
     * @returns new string of the built path so far
     */
    function buildPath(hostName, currPath) {
        let parent = hostJSON[hostName]["parent"]
            // if (parent) {
        if (parent === "home")
            return currPath;
        else if (hostJSON[parent]["backdoor"])
        // return buildPath(parent, `(${parent}) ; ${currPath}`); // highlight that the parent has a backdoor
            return `connect ${parent} ; ${currPath}`;
        else
            return buildPath(parent, `connect ${parent} ; ${currPath}`);
        // } else {
        // 	return currPath;
        // }
    }
}