/** @param {NS} ns */
export async function main(ns) {
	const termInput = document.getElementById("terminal-input");
	// termInput.value = "connect darkweb ; buy BruteSSH.exe ; home";
	termInput.value = "connect darkweb ; buy BruteSSH.exe ; buy FTPCrack.exe ; buy relaySMTP.exe ; buy HTTPWorm.exe ; buy SQLInject.exe ; home";

	const handler = Object.keys(termInput)[1];
	termInput[handler].onChange({ target: termInput });
	termInput[handler].onKeyDown({ key: 'Enter', preventDefault: () => null });
}