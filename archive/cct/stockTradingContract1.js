/** @param {NS} ns */
export async function main(ns) {
	let myArray = [127, 36, 155, 49, 103, 180, 111, 144, 176, 169, 68, 180, 83, 113];
	let maxDiff = 0;
	for (var i = 0; i < myArray.length; i++) {
		for (var j = i; j < myArray.length; j++) {
			maxDiff = Math.max(maxDiff, myArray[j] - myArray[i]);
		}
	}
	ns.tprint(maxDiff);
}