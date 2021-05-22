"use strict";

const path = require("path");

const {BrowserWindow, screen} = require("electron");

class MainWindow {
	constructor(parent) {
		this.parent    = parent;

		const bounds = this.parent.configService.get("window", {
			x      : screen.getPrimaryDisplay().bounds.width / 2 - 400,
			y      : screen.getPrimaryDisplay().bounds.height / 2 - 300,
			width  : 800,
			height : 600
		});

		this._instance = new BrowserWindow({
			width          : bounds.width,
			height         : bounds.height,
			x              : bounds.x,
			y               : bounds.y,
			minWidth       : 800,
			minHeight      : 300,
			show           : false,
			titleBarStyle  : "hiddenInset",
			webPreferences : {
				contextIsolation : true,
				preload          : path.join(__dirname, "..", "preload.js")
			}
		});
	}

	get instance() {
		return this._instance;
	}
}

module.exports = MainWindow;
