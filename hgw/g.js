export function autocomplete(data, args) { return [...data.servers]; }
export async function main(ns) { await ns.grow(ns.args[0]); }