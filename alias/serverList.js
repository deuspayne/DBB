import { buildServerList } from '/lib/helpers.js';
/** @param {NS} ns */
export async function main(ns) {
    let sList = buildServerList(ns);
    let sObjList = [];
    for (const sName of sList) {
        let sObject = ns.getServer(sName);
        sObjList.push({
            sName: sName,
            hSkill: sObject.requiredHackingSkill,
            poReq: sObject.numOpenPortsRequired,
        });
    }
    sObjList.sort((a, b) => { return a.poReq - b.poReq; })
    sObjList.sort((a, b) => { return a.hSkill - b.hSkill; })
    sObjList.forEach(ele => {
        ns.tprintf(`%-20s %4s (%s ports)`,
            ele.sName.concat(":"),
            ele.hSkill,
            ele.poReq,
        );
    })
}