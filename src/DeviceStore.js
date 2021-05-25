"use strict";

const {ipcMain, Notification, dialog} = require("electron");
const DiscoveryService                = require("./services/DiscoveryService");
const axios                           = require("axios");
const Std                             = require("./Std");
const FileService                     = require("./services/FileService");
const TasmotaDevice                   = require("./structs/TasmotaDevice");

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
		ipcMain.on("DeviceStore::all", () => this.parent.send("DeviceStore::updated", this.devices));

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

	renewInterval(immediate = true) {
		if (this.refreshInterval)
			clearInterval(this.refreshInterval);

		Std.Log(`[DeviceStore] Update interval changed to ${this.interval}`, Std.LogLevel.INFO);
		this.refreshInterval = setInterval(() => this.update(), parseInt(this.interval * 1000));
		if (immediate)
			this.update();
	}

	discover() {
		const choice = dialog.showMessageBoxSync(this.parent.mainWindow, {
			type      : "question",
			title     : "Rescan for devices",
			message   : "Do you really want to perform a new search?",
			detail    : "This action will remove all existing devices from your current device list.",
			buttons   : [
				"No, thanks",
				"Yes, i am shure"
			],
			defaultId : 0
		});

		if (choice !== 1) {
			this.parent.send("DeviceStore::discoveryComplete");

			return;
		}

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
			this.parent.send("DeviceStore::updated", this.devices);
			this.parent.send("DeviceStore::discoveryComplete");
		});
	}

	update() {
		if (this.discovering)
			return;

		const oldDevices = {...this.devices};
		let   different  = 0;

		const auth = this.useCredentials ? `${this.tasmotaUser}:${this.tasmotaPassword}@` : "";
		const promises = [];

		for (const device of Object.values(this.devices))
			promises.push(axios({
				method  : "get",
				url     : `http://${auth}${device.StatusNET.IPAddress}/cm?cmnd=status%200`,
				timeout : 500
			}));

		Promise.allSettled(promises).then((responses) => {
			for (const response of responses) {
				if (response.status === "rejected") {
					this.devices[response.value.request.host].alive = false;
					different++;
					continue;
				}
				if (!response.value.data.hasOwnProperty("Status") || response.value.status !== 200)
					continue;

				const newDevice  = new TasmotaDevice(response.value.data, true);
				const oldDevice  = oldDevices[response.value.data.StatusNET.IPAddress];
				const difference = newDevice.differs(oldDevice);

				if (difference === false)
					continue;

				this.devices[newDevice.StatusNET.IPAddress] = newDevice;
				different++;
				Std.Log(`Device '${newDevice.Status.DeviceName}' updated.`);
			}

			if (different > 0)
				this.parent.send("DeviceStore::updated", this.devices);
		}).catch(error => {});
	}
}

module.exports = DeviceStore;
