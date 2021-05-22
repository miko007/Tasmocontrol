"use strict";

const axios = require("axios").default;
const IPv4  = require("../structs/IPv4");
const Std   = require("../Std");

class DiscoveryService {
	constructor() {
		this.addressesChecked = 0;
		this.addressesToCheck = 0;
	}

	search(useCredentials, user, password) {
		return new Promise((resolve, reject) => {
			const [firstIP, lastIP] = IPv4.LocalRange();
			const auth              = useCredentials ? `${user}:${password}@` : "";

			this.addressesToCheck = lastIP.address.decimal() - firstIP.address.decimal() + 1;
			Std.Log(`[DiscoveryService] ${this.addressesToCheck} addresses to check`, Std.LogLevel.INFO);

			const promises = [];

			for (let start = firstIP.address.decimal(); start <= lastIP.address.decimal(); start++) {
				const ip   = new IPv4(start);
				promises.push(axios({
					method  : "get",
					url     : `http://${auth}${ip.address}/cm?cmnd=status%200`,
					timeout : 3000
				}));
			}

			Promise.allSettled(promises).then((responses) => {
				Std.Log(`[DiscoveryService] Scanning finished`, Std.LogLevel.INFO);
				const devices = [];
				for (const response of responses) {
					if (response.status === "rejected")
						continue;
					if (response.value.data.hasOwnProperty("Status") && response.value.status === 200) {
						devices.push(response.value.data);
						Std.Log(`[DiscoveryService] Device '${response.value.data.Status.DeviceName} added'`, Std.LogLevel.INFO);
					}
					this.addressesChecked++;
				}
				resolve(devices);
			}).catch(errors => {
			})
		});
	}
}

module.exports = DiscoveryService;
