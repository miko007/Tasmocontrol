"use strict";

const fs    = require("fs");
const fsp   = require("fs/promises");
const path  = require("path");
const {app} = require("electron");

class FileService {
	constructor(filename, sync = false) {
		this.filename = path.join(FileService.ConfigFolder, filename);
		this.sync     = sync;

		FileService.CheckAppFolder();
		try {
			fs.statSync(this.filename);
		} catch (error) {
			fs.writeFileSync(this.filename, "");
		}
	}

	load() {
		if (!this.sync)
			return fsp.readFile(this.filename);

		return fs.readFileSync(this.filename, {encoding : "utf8"});
	}

	save(data) {
		fsp.writeFile(this.filename, JSON.stringify(data, null, 4)).catch(error => {});
	}

	static CheckAppFolder() {
		try {
			fs.statSync(FileService.ConfigFolder);
		} catch (error) {
			fs.mkdirSync(FileService.ConfigFolder);
		}
	}
}
FileService.ConfigFolder = path.join(app.getPath("appData"), "tasmocontrol", "config");

module.exports = FileService;
