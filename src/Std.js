"use strict";

const electron = require("electron");
const Chalk    = require("chalk");

class Std {
	static Log(message, level) {
		level = level || Std.LogLevel.NORMAL;
		let date = new Date();
		let render = null;

		if (level !== Std.LogLevel.FATAL && !Std.IsDev())
			return;

		switch (level) {
			case Std.LogLevel.ERROR:
			case Std.LogLevel.FATAL:
				render = Chalk.red;
				break;
			case Std.LogLevel.INFO:
				render = Chalk.blue;
				break;
			case Std.LogLevel.SUCCESS:
				render = Chalk.green;
				break;
			case Std.LogLevel.WARN:
				render = Chalk.orange;
				break;
			case Std.LogLevel.NORMAL:
			default:
				render = Chalk.grey;
				break;
		}
		console.log(render(`${date.toDateString()} ${date.toLocaleTimeString()}\t${message}`));

		if (level === Std.LogLevel.FATAL)
			process.exit(1);
	}

	static Rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	static UcFirst(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	static Range(start, end) {
		return Array.from({length : end - start + 1 }, (_, i) => start + i);
	}

	static IsDev() {
		if (typeof electron === "string")
			Std.Log(`[Std] Electron not found`, Std.LogLevel.FATAL);

		const isEnvSet   = "ELECTRON_IS_DEV" in process.env;
		const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

		return isEnvSet ? getFromEnv : !electron.app.isPackaged;
	}
}
Std.LogLevel = {
	NORMAL  : 0,
	INFO    : 1,
	ERROR   : 2,
	SUCCESS : 3,
	WARN    : 4,
	FATAL   : 5,
};

module.exports = Std;
