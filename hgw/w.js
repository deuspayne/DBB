export function autocomplete(data, args) { return [...data.servers]; }
export async function main(ns) { await ns.weaken(ns.args[0]); }