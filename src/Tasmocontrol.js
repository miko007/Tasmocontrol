"use strict";

const {app, BrowserWindow} = require("electron");
const path                 = require("path");

const MainWindow    = require("./MainWindow");
const DeviceStore   = require("./DeviceStore");
const ConfigService = require("./services/ConfigService");
const CommandSerice = require("./services/CommandService");
const Std           = require("./Std");

class Tasmocontrol {
	constructor() {
		this.mainWindow     = null;
		this.deviceStore    = null;
		this.configService  = null;
		this.commandService = null;

		app.whenReady().then(() => this.init());

		app.on("window-all-closed", () => {
			if (process.platform !== "darwin")
				app.quit()
		});

		app.on("activate", () => {
			if (BrowserWindow.getAllWindows().length === 0)
				this.createWindow();
		})
	}

	createWindow() {
		this.mainWindow = new MainWindow(this).instance;
		this.mainWindow.on("ready-to-show", event => {
			this.mainWindow.show();
		});

		if (Std.IsDev())
			this.mainWindow.loadURL("http://localhost:3000");
		else
			this.mainWindow.loadURL(`file://${path.join(__dirname, "public", "build", "index.html")}`);

		this.mainWindow.on("resized", () => this.updateWindowConfig());
		this.mainWindow.on("moved", () => this.updateWindowConfig());
	}

	updateWindowConfig() {
		const windowBounds = this.mainWindow.getBounds();
		this.configService.set("window", windowBounds);
	}

	init() {
		this.configService  = new ConfigService(this);
		this.deviceStore    = new DeviceStore(this);
		this.commandService = new CommandSerice(this);
		this.createWindow();
	}

	send(...args) {
		if (BrowserWindow.getAllWindows().length === 0)
			return;
		this.mainWindow.webContents.send(...args);
	}
}

module.exports = Tasmocontrol;
