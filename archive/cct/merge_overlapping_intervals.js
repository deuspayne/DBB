// Merge Overlapping Intervals
// You are attempting to solve a Coding Contract. You have 15 tries remaining, after which the contract will self-destruct.


// Given the following array of array of numbers representing a list of intervals, merge all overlapping intervals.

// [[19,22],[3,11],[11,14],[8,13],[14,21],[18,26]]
//     becomes [[3,26]]

//
// Example:

// [[1, 3], [8, 10], [2, 6], [10, 16]]

// would merge into [[1, 6], [8, 16]].

// The intervals must be returned in ASCENDING order. You can assume that in an interval, the first number will always be smaller than the second.

/** @param {NS} ns */
export async function main(ns) {
	let inputArray = [[19, 22], [3, 11], [11, 14], [8, 13], [14, 21], [18, 26]];
	// ns.tprint("inputArray:"); ns.tprint(inputArray);

	// let result = shrinkArray(inputArray);
	// let newResult = [];
	let resArray = shrinkArray(inputArray);
	let rLength = resArray.length;
	let oldrLength = 0;
	// ns.tprint("resArray:"); ns.tprint(resArray);
	while (rLength != oldrLength) {
		// await ns.sleep(1000);
		oldrLength = rLength;
		resArray = shrinkArray(resArray);
		rLength = resArray.length;
		// ns.tprint("resArray:"); ns.tprint(resArray);
	}
	ns.tprint("INFO: final resArray:"); ns.tprint(resArray);


	/// BEGIN FUNCTIONS
	function shrinkArray(iArray) {
		let saReturn = [iArray[0]]; // put first element into the result to start comparing against
		// ns.tprint("gothere");ns.tprint(saReturn);ns.exit();
		for (const innerInput of iArray) {
			let found = false;
			for (const innerRes of saReturn) {
				if (innerInput[0] >= innerRes[0] && innerInput[0] <= innerRes[1]) { // new first num exists within a saReturn value
					innerRes[1] = Math.max(innerInput[1], innerRes[1]);
					found = true;
					break;
				} else if (innerInput[1] >= innerRes[0] && innerInput[1] <= innerRes[1]) { // new second num exists within a saReturn value
					innerRes[0] = Math.min(innerInput[0], innerRes[0]);
					found = true;
					break;
				}
			}
			if (!found) {
				saReturn.push(innerInput);
			}
			// ns.tprint("innerInput:");ns.tprint(innerInput);
			// ns.tprint("saReturn:");ns.tprint(saReturn);
		}
		return saReturn;
	}
}