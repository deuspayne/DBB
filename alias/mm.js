// TODO put values from scansecurity into chart 
// TODO build server list at launch with lib
// TODO modify this so that it doesn't strip out servers from the list.
// TODO put in way to display actively hackable

export function autocomplete(ns, args) {
    let acArray = [
        "name",
        "moneyAvailable",
        "moneyMax",
        "toGrow",
        "mPct",
        "serverGrowth",
        "moneyExpected",
        "growTime",
        "growPerTime",
        "hackTime",
        "hackDifficulty",
        "minDifficulty",
        "diffPct",
        "moneyPerTime",
        "weakenTime",
    ];
    return acArray;
}
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    let sortKey = ns.args[0] || "moneyMax";
    let maxNameLen = ns.args[1] || 9;
    // let sortKey = ns.args || ["mPct","-diffPct"]; // TODO add second sort

    let serverHashList = [
        { name: "." },
        { name: "4sigma" },
        { name: "CSEC" },
        { name: "I.I.I.I" },
        { name: "The-Cave" },
        { name: "aerocorp" },
        { name: "aevum-police" },
        { name: "alpha-ent" },
        { name: "applied-energetics" },
        { name: "avmnite-02h" },
        { name: "b-and-a" },
        { name: "blade" },
        { name: "catalyst" },
        { name: "clarkinc" },
        { name: "computek" },
        { name: "crush-fitness" },
        { name: "defcomm" },
        { name: "deltaone" },
        { name: "ecorp" },
        { name: "foodnstuff" },
        { name: "fulcrumassets" },
        { name: "fulcrumtech" },
        { name: "galactic-cyber" },
        { name: "global-pharm" },
        { name: "harakiri-sushi" },
        { name: "helios" },
        { name: "home" },
        { name: "hong-fang-tea" },
        { name: "icarus" },
        { name: "infocomm" },
        { name: "iron-gym" },
        { name: "joesguns" },
        { name: "johnson-ortho" },
        { name: "kuai-gong" },
        { name: "lexo-corp" },
        { name: "max-hardware" },
        { name: "megacorp" },
        { name: "microdyne" },
        { name: "millenium-fitness" },
        { name: "n00dles" },
        { name: "nectar-net" },
        { name: "neo-net" },
        { name: "netlink" },
        { name: "nova-med" },
        { name: "nwo" },
        { name: "omega-net" },
        { name: "omnia" },
        { name: "omnitek" },
        { name: "phantasy" },
        { name: "powerhouse-fitness" },
        { name: "rho-construction" },
        { name: "rothman-uni" },
        { name: "run4theh111z" },
        { name: "sigma-cosmetics" },
        { name: "silver-helix" },
        { name: "snap-fitness" },
        { name: "solaris" },
        { name: "stormtech" },
        { name: "summit-uni" },
        { name: "syscore" },
        { name: "taiyang-digital" },
        { name: "the-hub" },
        { name: "titan-labs" },
        { name: "unitalife" },
        { name: "univ-energy" },
        { name: "vitalife" },
        { name: "zb-def" },
        { name: "zb-institute" },
        { name: "zer0" },
        { name: "zeus-med" },
    ];

    ns.tail();
    while (true) {
        let totalMoney = 0;
        let totalMaxMoney = 0;
        let numServers = 0;
        // serverHashList.forEach(serverName => {
        for (let i = 0; i < serverHashList.length; i++) {
            let serverObject = ns.getServer(serverHashList[i]["name"]);
            if (!serverObject.hasAdminRights || serverObject.moneyMax === 0 || serverObject.requiredHackingSkill > ns.getHackingLevel()) {
                // can't hack anyways or no money to get
                serverHashList.splice(i, 1);
                i--;
            } else {
                // build values in hash list
                serverHashList[i].moneyAvailable = serverObject.moneyAvailable;
                serverHashList[i].moneyMax = serverObject.moneyMax;
                serverHashList[i].toGrow = serverObject.moneyMax - serverObject.moneyAvailable;
                serverHashList[i].mPct = serverObject.moneyAvailable / serverObject.moneyMax;
                serverHashList[i].serverGrowth = serverObject.serverGrowth;
                serverHashList[i].moneyExpected = ns.hackAnalyze(serverHashList[i].name) * serverObject.moneyAvailable;
                serverHashList[i].growTime = ns.getGrowTime(serverHashList[i].name);
                serverHashList[i].growPerTime = 6000 * serverHashList[i].serverGrowth / serverHashList[i].growTime;
                serverHashList[i].hackTime = ns.getHackTime(serverHashList[i].name);
                serverHashList[i].moneyPerTime = 6000 * serverHashList[i].moneyExpected / serverHashList[i].hackTime;
                serverHashList[i].weakenTime = ns.getWeakenTime(serverHashList[i].name);
                serverHashList[i].hackDifficulty = serverObject.hackDifficulty;
                serverHashList[i].minDifficulty = serverObject.minDifficulty;
                serverHashList[i].diffPct = (serverObject.hackDifficulty - serverObject.minDifficulty) / serverObject.minDifficulty;
                // increment total money
                totalMoney += serverObject.moneyAvailable;
                totalMaxMoney += serverObject.moneyMax;
                numServers++;
            }
        }

        // sort list
        // serverHashList.sort((a, b) => { return a["diffPct"] - b["diffPct"] })
        serverHashList.sort((a, b) => { return b[sortKey] - a[sortKey]; })

        let formatArray = [
            { "width": -maxNameLen - 2, "name": "Server Name", },
            { "width": 8, "name": "mAvail", },
            // { "width": 16, "name": "toGrow", },
            { "width": 8, "name": "mMax", },
            { "width": 12, "name": "mPct", },
            // { "width": 13, "name": "moneyExpected", },
            { "width": 4, "name": "hT ", },
            // { "width": 12, "name": "moneyPerTime", },
            // { "width": 12, "name": "serverGrowth", },
            // { "width": 4, "name": "gT ", },
            // { "width": 11, "name": "growPerTime", },
            { "width": 4, "name": "wT ", },
            { "width": 4, "name": "dPct", },
            // { "width": 14, "name": "hackDifficulty", },
            // { "width": 13, "name": "minDifficulty", },

        ];
        let formatString = "";;
        let formatName = [];
        let formatDivider = [];
        for (const key in formatArray) {
            formatString += `%${formatArray[key]["width"]}s `;
            formatName.push(formatArray[key]["name"]);
            formatDivider.push('-'.repeat(Math.abs(formatArray[key]["width"])));
        }
        ns.clearLog();
        // ns.printf(formatString, ...formatDivider);
        // ns.printf("");
        ns.printf(formatString, ...formatName);
        ns.printf(formatString, ...formatDivider);
        serverHashList.forEach(server => {
            ns.printf(
                formatString,
                server["name"].slice(0, maxNameLen).concat((server["name"].length < maxNameLen) ? "" : ".."),
                ns.nFormat(server.moneyAvailable, "$0.00a"),
                // formatter.format(server["toGrow"]),
                ns.nFormat(server.moneyMax, "$0.00a"), //'|'.repeat(scriptBars),
                `[${'|'.repeat(Math.round(server.mPct*10))}${' '.repeat(10-Math.round(server.mPct*10))}]`, // `[${ns.nFormat(server.mPct, "0.%")}]`,//(.01 * Math.round(100 * server.mPct)).toFixed(2) + " %",
                // formatter.format(server["moneyExpected"]),
                ns.nFormat(server.hackTime / 60000, "0,0.0"),
                // formatter.format(server["moneyPerTime"]),
                // formatter.format(server["serverGrowth"]), // unknown what this value actually is
                // ns.nFormat(server.growTime / 60000, "0,0.0"),
                // formatter.format(server["growPerTime"]),
                ns.nFormat(server.weakenTime / 60000, "0,0.0"),
                ns.nFormat(server.diffPct, "0%"), //(.01 * Math.round(100 * server.diffPct)).toFixed(2) + " %",
                // (.01*Math.round(100*server.hackDifficulty)).toFixed(2),
                // (.01*Math.round(100*server.minDifficulty)).toFixed(2),
            );
        })
        ns.printf("%s of %s (%s) total on [%s] servers",
            ns.nFormat(totalMoney, "$0.00a"),
            ns.nFormat(totalMaxMoney, "$0.00a"),
            ns.nFormat(totalMoney / totalMaxMoney, "0,0.0%"),
            numServers);

        await ns.sleep(1000);
    }
}