"use strict";

const {ipcMain}           = require("electron");
const {networkInterfaces} = require("os");

class NetworkService {
	constructor(parent) {
		this.parent      = parent;
		this._interfaces = null;

		this.scan();
		ipcMain.on("NetworkService::interfaces", () => this.parent.send("NetworkService::interfacesReply", this.interfaces))
	}

	scan() {
		const ifaces    = networkInterfaces();
		this._interfaces = {};

		for (const iface of Object.keys(ifaces)) {
			this._interfaces[iface] = {name : iface, addresses : ifaces[iface]};
		}
	}

	get interfaces() {
		return this._interfaces;
	}

}

module.exports = NetworkService;
