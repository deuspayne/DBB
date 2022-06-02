import { buildServerList } from '/lib/helpers.js';

let _outFile = "/output/autoNuke.txt";
let _writeMode = "a";
let _sleepVal = "60000";
let _crackerList = // list of programs to open ports
    [
        { name: "BruteSSH.exe", exists: false, port: "sshPortOpen" },
        { name: "FTPCrack.exe", exists: false, port: "ftpPortOpen" },
        { name: "relaySMTP.exe", exists: false, port: "smtpPortOpen" },
        { name: "HTTPWorm.exe", exists: false, port: "httpPortOpen" },
        { name: "SQLInject.exe", exists: false, port: "sqlPortOpen" },
    ];

/** @param {NS} ns */
export async function main(ns) {
    // builds server list from helper.js
    let serverList = buildServerList(ns);
    let numCracks = 0;

    do {
        let hackingLevel = ns.getHackingLevel();
        numCracks = getNumCracks();
        for (const serverName of serverList) {
            let serverObject = ns.getServer(serverName);
            if (!serverObject.hasAdminRights && serverObject.requiredHackingSkill <= hackingLevel && serverObject.numOpenPortsRequired <= numCracks) {
                // NUKE IT
                try { ns.brutessh(serverName); } catch {}
                try { ns.ftpcrack(serverName); } catch {}
                try { ns.relaysmtp(serverName); } catch {}
                try { ns.httpworm(serverName); } catch {}
                try { ns.sqlinject(serverName); } catch {}
                try { ns.nuke(serverName); } catch {}
                await ns.write(_outFile, `${serverName} is cracked\n`, _writeMode);
            }
        }
        await ns.sleep(_sleepVal); // sleep 1 minute
    } while (true);

    /// BEGIN FUNCTIONS
    function getNumCracks() {
        let numCracks = 0;
        for (const cracker of _crackerList) {
            if (cracker.exists) numCracks++;
            else {
                if (ns.fileExists(cracker.name, "home")) {
                    cracker.exists = true;
                    numCracks++;
                } else {
                    // TODO perhaps buy the crack if we have enough money
                }
            }
        }
        return numCracks;
    }
}