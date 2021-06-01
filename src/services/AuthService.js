"use strict";

class AuthService {
	constructor(parent) {
		this.parent          = parent;
		this.configService   = parent.configService;
		this.useCredentials  = this.configService.get("useCredentials", false);
		this.tasmotaUser     = this.configService.get("tasmotaUser", "admin");
		this.tasmotaPassword = this.configService.get("tasmotaPassword", "");

		parent.configService.addListener("useCredentials",  newValue => this.useCredentials = newValue);
		parent.configService.addListener("tasmotaPassword", newValue => this.tasmotaPassword = newValue);
		parent.configService.addListener("tasmotaUser",     newValue => this.tasmotaUser = newValue);
	}

	toString() {
		return this.useCredentials ? `&user=${this.tasmotaUser}&password=${this.tasmotaPassword}` : "";
	}
}

module.exports = AuthService;
