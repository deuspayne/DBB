let argSchema = [
    ['tail', false],
    ['money', 1e9], // 1e9 = 1 billion, 1e6 = 1 million
];
let _symbols = ["ECP", "MGCP", "BLD", "CLRK", "OMTK", "FSIG", "KGI", "FLCM", "STM", "DCOMM", "HLS", "VITA", "ICRS", "UNV", "AERO", "OMN", "SLRS", "GPH", "NVMD", "WDS", "LXO", "RHOC", "APHE", "SYSC", "CTK", "NTLK", "OMGA", "FNS", "JGN", "SGC", "CTYS", "MDYN", "TITN"];;
export function autocomplete(data, args) {
    data.flags(argSchema);
    return [..._symbols];
}
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    ns.disableLog("stock.buy");
    ns.disableLog("stock.sell");
    ns.tail();
    let argFlags = ns.flags(argSchema);
    let symList = (argFlags._.length > 0) ? argFlags._ : _symbols; // ns.stock.getSymbols();
    let outfile = "/output/stockProfit.txt";
    let writeMode = "w"; // w = overwrite, a = append
    let totalProfit = 0;

    // TODO do all this while loop below in the gathering of data, and get new stockObject every loop
    do {
        let stockArray = getStocks(symList);
        // stockArray.forEach(stockObject => {
        for (const stockObject of stockArray) {
            // ns.print(`${stockObject.sym}: ${stockObject.forecast}`);
            let numShares = argFlags.money / stockObject.askPrice; // askPrice seems to always be the highest. not sure if true
            // numShares = Math.floor(.9 * numShares); // only buy 90%, top
            numShares = Math.min(numShares, stockObject.maxShares); // can't buy more than the max
            let buyTotalPrice = numShares * stockObject.askPrice;
            if (stockObject.forecast >= .15 && stockObject.position[0] == 0) {
                ns.print(`(${new Date().toLocaleTimeString()}) (${stockObject.sym})[${ns.nFormat(stockObject.forecast, "0.0%")}] Attempting to buy ${ns.nFormat(numShares, "0,0")} shares for ${ns.nFormat(buyTotalPrice, "$0,0.00")}.`)
                ns.stock.buy(stockObject.sym, numShares);
            } else if (stockObject.forecast < 0 && stockObject.position[0] > 0 && stockObject.position[1] < stockObject.askPrice) {
                let thisProfit = -stockObject.position[0] * stockObject.position[1];
                thisProfit += stockObject.position[0] * ns.stock.sell(stockObject.sym, stockObject.position[0]);
                totalProfit += thisProfit;
                await ns.write(outfile, `(${new Date().toLocaleTimeString()}) thisProfit: ${ns.nFormat(thisProfit,"$0,0")}\ttotalling: ${ns.nFormat(totalProfit,"$0,0")}\n`, writeMode);
                // await ns.write(outfile, `(${new Date().toLocaleTimeString()}) totalProfit: ${ns.nFormat(totalProfit,"$0,0")}\n`, writeMode);
                ns.print(`(${new Date().toLocaleTimeString()}) (${stockObject.sym})[${ns.nFormat(stockObject.forecast, "0.0%")}] Forecast was bad, sold full position for [${ns.nFormat(thisProfit, "$0,0")}]`);
            } else {
                // ns.print(`(${new Date().toLocaleTimeString()}) Holding...`)
            }
        }
        await ns.sleep(10000);
        // await ns.write(outfile, `totalProfit: ${ns.nFormat(totalProfit,"$0,0")}`, writeMode);
    } while (true);

    /// FUNCTIONS
    function getStocks(sList) {
        let retArray = [];
        sList.forEach(sym => {
            let askPrice = ns.stock.getAskPrice(sym);
            // let bidPrice = ns.stock.getBidPrice(sym);
            // let price = ns.stock.getPrice(sym);
            let forecast = 2 * (ns.stock.getForecast(sym) - .5); // normalize forecast to -1 to 1 instead of 0 to 1
            let maxShares = ns.stock.getMaxShares(sym);
            // let volatility = ns.stock.getVolatility(sym);
            let position = ns.stock.getPosition(sym);
            // let marketCap = price * maxShares;
            retArray.push({
                sym: sym,
                askPrice: askPrice,
                // // bidPrice: bidPrice,
                // price: price,
                forecast: forecast,
                maxShares: maxShares,
                // volatility: volatility,
                // marketCap: marketCap,
                position: position,
            });
        });
        return retArray;
    }
}