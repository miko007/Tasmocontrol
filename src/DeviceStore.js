"use strict";

const {ipcMain, Notification} = require("electron");
const DiscoveryService        = require("./services/DiscoveryService");
const axios                   = require("axios");
const Std                     = require("./Std");
const FileService             = require("./services/FileService");
const TasmotaDevice           = require("./structs/TasmotaDevice");

class DeviceStore {
	constructor(parent) {
		this.parent            = parent;
		this.devices           = {};
		this.discoveryService  = new DiscoveryService();
		this.fileService       = new FileService("devices.json");
		this.discovering       = false;
		this.interval          = parent.configService.get("interval", 2);
		this.refreshInterval   = null;

		this.useCredentials    = parent.configService.get("useCredentials", false);
		this.tasmotaUser       = parent.configService.get("tasmotaUser", "admin");
		this.tasmotaPassword   = parent.configService.get("tasmotaPassword", "");

		this.fileService.load().then(content  => {
			this.devices = JSON.parse(content)
			this.parent.send("DeviceStore::updated", Object.values(this.devices));
		}).catch((error) => {
			Std.Log(`[DeviceStore] ERROR could not load devices file: ${error}`, Std.LogLevel.ERROR);
			this.devices = {};
			this.fileService.save({});
		});


		ipcMain.on("DeviceStore::search", () => this.discover());
		ipcMain.on("DeviceStore::single", (_, ip) => this.sendSingleDevice(ip));

		this.renewInterval();

		parent.configService.addListener("interval", newValue => {
			this.interval = parseInt(newValue);
			this.renewInterval();
		});
		parent.configService.addListener("useCredentials", newValue => this.useCredentials = newValue);
		parent.configService.addListener("tasmotaPassword", newValue => this.tasmotaPassword = newValue);
		parent.configService.addListener("tasmotaUser", newValue => this.tasmotaUser = newValue);
	}

	sendSingleDevice(ip) {
		this.parent.send("DeviceStore::device", this.devices[ip]);
	}

	renewInterval() {
		if (this.refreshInterval)
			clearInterval(this.refreshInterval);

		Std.Log(`[DeviceStore] Update interval changed to ${this.interval}`, Std.LogLevel.INFO);
		this.refreshInterval = setInterval(() => this.update(), parseInt(this.interval * 1000));
		this.update();
	}

	discover() {
		this.discovering = true;
		this.devices     = {};
		this.discoveryService.search(this.useCredentials, this.tasmotaUser, this.tasmotaPassword).then(devices => {
			for (const device of devices) {
				this.devices[device.StatusNET.IPAddress] = new TasmotaDevice(device, true);
			}

			new Notification({
				title : `Info`,
				body  : `Scanning for new TASMOTA devices finished.`
			}).show();

			this.fileService.save(this.devices);
			this.discovering = false;
			this.parent.send("DeviceStore::updated", Object.values(this.devices));
			this.parent.send("DeviceStore::discoveryComplete");
		});
	}

	update() {
		if (this.discovering)
			return;
		const auth = this.useCredentials ? `${this.tasmotaUser}:${this.tasmotaPassword}@` : "";
		for (const device of Object.values(this.devices)) {
			axios({
				method  : "get",
				url     : `http://${auth}${device.StatusNET.IPAddress}/cm?cmnd=status%200`,
				timeout : 500
			}).then(response => {
				if (!response.data.hasOwnProperty("Status") || response.status !== 200)
					return;

				this.devices[device.StatusNET.IPAddress] = new TasmotaDevice(response.data, true);
				Std.Log(`Device '${response.data.Status.DeviceName}' updated.`);
			}).catch(error => {
				if (this.devices.hasOwnProperty(device.StatusNET.IPAddress))
					this.devices[device.StatusNET.IPAddress].alive = false;
			});
		}
		this.parent.send("DeviceStore::updated", Object.values(this.devices));
	}
}

module.exports = DeviceStore;
