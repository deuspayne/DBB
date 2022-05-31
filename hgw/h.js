export function autocomplete(data, args) { return [...data.servers]; }
export async function main(ns) { await ns.hack(ns.args[0]); }