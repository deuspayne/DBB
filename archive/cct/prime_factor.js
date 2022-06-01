/** @param {NS} ns */
export async function main(ns) {
	let argFlags = ns.flags([['test', false]]);

	let num = argFlags._[0];
	let divisor = 2;
	let resultArray = [];
	while (num >= 2) {
		if (num % divisor == 0) {
			resultArray.push(divisor);
			num = num / divisor;
		} else {
			divisor++;
		}
	}
	ns.tprint(resultArray);
	ns.tprint(Math.max(...resultArray));
}