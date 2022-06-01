/** @param {NS} ns */
export async function main(ns) {
	ns.tprint("Ran test.js");
	// let locationList = ns.infiltration.getPossibleLocations();
	// ns.tprint(locationList);
	// // ns.tprint(JSON.parse(locationList));
	// ns.tprint(JSON.stringify(locationList));
	// for (const location of locationList) {
	// 	ns.tprint((location));
	// 	ns.tprint(JSON.stringify(location));
	// }
	// let tVal = 0;
	// let testHash = {
	// 	"functionParens": function () { return tVal++; },
	// 	"parensArrow": () => { return tVal++; },
	// 	"underscoreArrow": _ => { return tVal++; },
	// };

	// ns.tprint(testHash.functionParens());
	// ns.tprint(testHash.parensArrow());
	// ns.tprint(testHash.underscoreArrow());


	const handler = {
		get(obj, prop) {
			return prop in obj ?
				obj[prop] :
				37;
		}
	};

	const p = new Proxy({}, handler);
	p.a = 1;
	p.b = undefined;

	ns.tprint(p.a, p.b);
	//  1, undefined

	ns.tprint('c' in p, p.c);
	//  false, 37


	let myObj = {};
	Object.defineProperty(myObj, "noParenKeyValAccess", {
		get: function() { return ns.getPlayer().money }
	});
	myObj.normalKey = "set by hand";
	ns.print(myObj.bunkKey);
	ns.print(myObj.noParenKeyValAccess);
	ns.print(myObj);
	await ns.sleep(1000);
	ns.print(myObj.noParenKeyValAccess);
	ns.print(myObj);
}