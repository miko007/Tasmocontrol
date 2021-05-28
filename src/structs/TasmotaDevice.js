"use strict";

const _ = require("lodash");

class TasmotaDevice {
	constructor(data, alive = false) {
		this.alive = alive;
		Object.assign(this, _.cloneDeep(data));
	}

	differs(other) {
		if (!other.hasOwnProperty("Status"))
			return true;

		const $this  = _.clone(this);
		const $other = _.clone(other);

		/*
		 * Removing constantly changing values
		 */
		delete $this.StatusMEM.Heap;
		delete $this.StatusSTS;
		delete $this.StatusSNS;
		delete $this.StatusTIM;
		delete $this.StatusPRM.Uptime;

		delete $other.StatusMEM.Heap;
		delete $other.StatusSTS;
		delete $other.StatusSNS;
		delete $other.StatusTIM;
		delete $other.StatusPRM.Uptime;

		return JSON.stringify($this) !== JSON.stringify($other);
	}
}

module.exports = TasmotaDevice;
