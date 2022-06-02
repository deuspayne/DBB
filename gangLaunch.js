/** @param {NS} ns */
export async function main(ns) {
    ns.tail(ns.exec("gangSetJob.js", "home", 1, "--task", "Vigilante Justice"));
    ns.tail(ns.exec("gangSetJob.js", "home", 1, "--task", "Terrorism", "--minStats", 2500));
    ns.tail(ns.exec("gangSetJob.js", "home", 1, "--task", "Traffick Illegal Arms", "--minStats", 1000));
    ns.tail(ns.exec("gangSetJob.js", "home", 1, "--task", "Train Combat"));
    ns.tail(ns.exec("gangSetJob.js", "home", 1, "--pulse"));
    ns.tail(ns.exec("gangPulse.js", "home", 1));
    // ns.tail(ns.exec("gangSetJob.js", "home", 1, "--task", "Ethical Hacking"));
    // ns.tail(ns.exec("gangSetJob.js", "home", 1, "--task", "Cyberterrorism", "--minStats", 4000));
    // ns.tail(ns.exec("gangSetJob.js", "home", 1, "--task", "Money Laundering", "--minStats", 1500));
    // ns.tail(ns.exec("gangSetJob.js", "home", 1, "--task", "Train Hacking"));
    ns.exec("gangMonitor.js", "home", 1);
}