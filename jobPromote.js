/** @param {NS} ns */
export async function main(ns) {
    // TODO use singularity to auto promote jobs while they're working.
    const jobTypes = ["Business", "IT", "Security", "Software"];
    ns.tail();
    ns.singularity.applyToCompany("Four Sigma", "Software");
}