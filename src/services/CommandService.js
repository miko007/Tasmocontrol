"use strict";

const {ipcMain} = require("electron");
const axios     = require("axios");

class CommandService {
	constructor(parent) {
		this.parent          = parent;
		this.authService     = parent.authService;
		this.useCredentials  = parent.configService.get("useCredentials", false);
		this.tasmotaUser     = parent.configService.get("tasmotaUser", "admin");
		this.tasmotaPassword = parent.configService.get("tasmotaPassword", "");

		this.parent.configService.addListener("useCredentials", newValue => this.useCredentials = newValue);
		this.parent.configService.addListener("tasmotaUser", newValue => this.tasmotaUser = newValue);
		this.parent.configService.addListener("tasmotaPassword", newValue => this.tasmotaPassword = newValue);

		ipcMain.on("CommandService::send", (_, [ip, command, payload]) => this.send(ip, command, payload));
		ipcMain.handle("CommandService::sendImmediate", async (event, [ip, command]) => {
			try {
				const response = await axios.get(`http://${ip}/cm?cmnd=${encodeURIComponent(command)}${this.authService}`);

				return response.data;
			} catch (error) {
				return null;
			}

		});
	}

	send(ip, command, payload) {
		return axios.get(`http://${ip}/cm?cmnd=${command}%20${payload}${this.authService}`);
	}
}

module.exports = CommandService;
