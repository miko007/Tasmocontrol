"use strict";

class TasmotaDevice {
	constructor(data, alive = false) {
		this.alive = alive;
		Object.assign(this, data);
	}

	differs(other) {
		if (!other.hasOwnProperty("Status"))
			return true;

		return (
			this.Status.Power        !== other.Status.Power ||
			this.StatusNET.IPAddress !== other.StatusNET.IPAddress
		);
	}
}

module.exports = TasmotaDevice;
