"use strict";

const {ipcMain} = require("electron");
const axios     = require("axios");

class CommandService {
	constructor(parent) {
		this.parent          = parent;
		this.useCredentials  = parent.configService.get("useCredentials", false);
		this.tasmotaUser     = parent.configService.get("tasmotaUser", "admin");
		this.tasmotaPassword = parent.configService.get("tasmotaPassword", "");

		this.parent.configService.addListener("useCredentials", newValue => this.useCredentials = newValue);
		this.parent.configService.addListener("tasmotaUser", newValue => this.tasmotaUser = newValue);
		this.parent.configService.addListener("tasmotaPassword", newValue => this.tasmotaPassword = newValue);

		ipcMain.on("CommandService::send", (_, [ip, command, payload]) => this.send(ip, command, payload));
		ipcMain.handle("CommandService::sendImmediate", async (event, [ip, command]) => {
			console.log(this.auth);
			const auth     = this.useCredentials ? `${this.tasmotaUser}:${this.tasmotaPassword}@` : "";
			const response = await axios.get(`http://${auth}${ip}/cm?cmnd=${encodeURIComponent(command)}`);

			return response.data;
		});
	}

	get auth() {
		this.useCredentials ? `${this.tasmotaUser}:${this.tasmotaPassword}@` : "";
	}

	send(ip, command, payload) {
		return axios.get(`http://${this.auth}${ip}/cm?cmnd=${command}%20${payload}`);
	}
}

module.exports = CommandService;
