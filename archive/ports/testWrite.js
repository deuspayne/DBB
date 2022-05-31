let confSchema = [
	// ['delay', 0], // a default number means this flag is a number
	// ['server', 'foodnstuff'], //  a default string means this flag is a string
	// ['exclude', []], // a default array means this flag is a default array of string
	// ['help', false], // a default boolean means this flag is a boolean
	['port', 1],
	['script', ''],
	['skip',false]
];

export function autocomplete(ns, args) { // this appears to only return an autocomplete for scripts if the last arg was --script
    ns.flags(argsSchema);
    const lastFlag = args.length > 1 ? args[args.length - 2] : null;
    if (lastFlag == "--script")
        return ns.scripts;
    return [];
}
/** @param {NS} ns */
export async function main(ns) {

	let data = ns.flags(confSchema);
	ns.tprint(data);
	ns.tprint(ns.args);
	// ns.writePort(1, ns.args[0]);
	ns.writePort(1, data.toString());
}