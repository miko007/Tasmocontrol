"use strict";

const Std = require("../Std");
const _   = require("lodash");

class TasmotaDevice {
	constructor(data, alive = false) {
		this.alive = alive;
		Object.assign(this, _.cloneDeep(data));
	}

	differs(other) {
		if (!other.hasOwnProperty("Status"))
			return true;

		return (
			this.Status.Power        !== other.Status.Power ||
			this.StatusNET.IPAddress !== other.StatusNET.IPAddress ||
			!_.isEqual(this.Status.FriendlyName, other.Status.FriendlyName)
		);
	}
}

module.exports = TasmotaDevice;
