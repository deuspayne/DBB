/** @param {NS} ns */
export async function main(ns) {
    let pObject = ns.getPlayer();
    ns.tprintf(`numPeopleKilled: ${pObject.numPeopleKilled}`);
    // for (const key in pObject) {
    // 	ns.tprint(`${key}: ${pObject[key]}`);
    // }
    ns.tprintf(`karma: ${ns.heart.break()}`);
}