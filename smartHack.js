export function autocomplete(data, args) {
    return [...data.servers];
}
let argSchema = [
        ['help', false],
    ]
    /** @param {NS} ns */
export async function main(ns) {
    let argFlags = ns.flags(argSchema);
    ns.disableLog("ALL");
    let serverList = argFlags._;
    let totalLoopTime = 10000; // 10 seconds total time waiting to loop, split between all servers
    let securityLimit = .08;
    let moneyLimit = .92;
    while (true) { // forever loop
        for (const serverName of serverList) { // loop over servers
            // let serverName = serverList[key];
            // let serverObject = ns.getServer(serverName);
            let monAvail = ns.getServerMoneyAvailable(serverName);
            let monMax = ns.getServerMaxMoney(serverName);
            let secLevel = ns.getServerSecurityLevel(serverName);
            let secMin = ns.getServerMinSecurityLevel(serverName);
            // while (serverObject.moneyAvailable / serverObject.moneyMax < moneyLimit) { // while money low
            // 	while ((serverObject.hackDifficulty - serverObject.minDifficulty) / serverObject.minDifficulty > securityLimit) { // while security high
            // 		await ns.weaken(serverName);
            // 		// serverObject = ns.getServer(serverName);
            // 	}
            // 	await ns.grow(serverName);
            // 	// serverObject = ns.getServer(serverName);
            // }
            // ns.print(`Money: ${ns.nFormat(monAvail / monMax,"0.00")}\tSecurity: ${ns.nFormat((secLevel - secMin) / secMin,"0.00")}`);
            if ((monAvail) / monMax >= moneyLimit && (secLevel - secMin) / secMin < securityLimit && ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(serverName)) {
                ns.print(`${new Date().toLocaleTimeString()} - Hacking!`);
                let hackedAmmount = await ns.hack(serverName);
                ns.print(`${new Date().toLocaleTimeString()} - ${ns.nFormat(hackedAmmount, "$0,0")} hacked!`);
            } else {
                // ns.print(`Not ripe, sleeping`);
                await ns.sleep(totalLoopTime / serverList.length);
            }
            // serverObject = ns.getServer(serverName);
        }
        // total loop time split between server list
    }
}