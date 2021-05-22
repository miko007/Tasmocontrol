"use strict";

const {ipcMain}  = require("electron");
const FileService = require("./FileService");

class ConfigService {
	constructor(parent) {
		this.parent      = parent;
		this.config      = {};
		this.fileService = new FileService("config.json", true);
		this.callbacks   = [];
		this.listeners   = {};

		try {
			this.config = JSON.parse(this.fileService.load());
		} catch (error) {
				this.fileService.save({});
		}

		this.transmit();

		ipcMain.on("ConfigService::request", () => this.transmit());
		ipcMain.on("ConfigService::set", (_, [key, value]) => this.set(key, value));
	}

	addListener(key, callback) {
		if (!this.listeners.hasOwnProperty(key))
			this.listeners[key] = [];
		this.listeners[key].push(callback);
	}

	transmit() {
		this.parent.send("ConfigService::changed", this.config);
	}

	get(key, defaultValue = null) {
		if (this.config.hasOwnProperty(key))
			return this.config[key];

		return defaultValue;
	}

	set(key, value) {
		this.config[key] = value;
		this.fileService.save(this.config);
		this.transmit();

		if (!this.listeners.hasOwnProperty(key))
			return;

		for (const listener of this.listeners[key])
			listener(value);
	}
}

module.exports = ConfigService;
