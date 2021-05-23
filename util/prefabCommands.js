"use strict";

const path = require("path");
const fs   = require("fs").promises;
const Std  = require("../src/Std");

const commandsFilePath = path.join(__dirname, "..", "src", "public", "src", "assets", "commands.json");

class Command {
	constructor(value, label = "") {
		this.value = value.replace(/"/g, "").trim();
		this.label = label.trim();
	}
}

fs.readFile(path.join(__dirname, "..", "tasmota", "i18n.h"), {encoding : "utf8"}).then(contents => {
	const lines    = contents.split("\n");
	const commands = [];

	for (const line of lines) {
		if (!line.match(/^#define/))
			continue;
		const regex = new RegExp(/(?<id>[A-Z_]+) (?<cmd>".*")/);
		const command = regex.exec(line);
		if (!command || !command.groups || !command.groups.id.match(/D_CMND/))
			continue;

		commands.push(new Command(command.groups.cmd, command.groups.id));
	}

	fs.writeFile(commandsFilePath, JSON.stringify(commands, null, 4));
	console.log(commands);
	Std.Log(`${commands.length} commands have been added to '${commandsFilePath}'`, Std.LogLevel.SUCCESS);

}).catch(error => console.error(error));
