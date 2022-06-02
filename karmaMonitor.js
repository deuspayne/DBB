/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    do {
        ns.tail();
        ns.clearLog();
        let pObject = ns.getPlayer();
        ns.printf(`numPeopleKilled: %s`, pObject.numPeopleKilled);
        ns.printf(`karma: %s`, ns.nFormat(ns.heart.break(), "0,0.00"));
        await ns.sleep(1000);
    } while (true);
}