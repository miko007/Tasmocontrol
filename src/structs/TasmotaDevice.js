"use strict";

class TasmotaDevice {
	constructor(data, alive = false) {
		this.alive = alive;
		Object.assign(this, data);
	}
}

module.exports = TasmotaDevice;
