"use strict";

const {networkInterfaces} = require("os");

class OctetStreamIP {
	constructor(octetStream) {
		this.stream = octetStream || "";
		if (typeof octetStream === "number")
			this.address();
		this.octets = this.stream ? this.stream.split(".") : [];
	}

	toString() {
		return this.stream;
	}

	decimal() {
		return this.octets.reduce((int, octet) => (int << 8) + parseInt(octet, 10), 0) >>> 0;
	}

	address() {
		this.stream = ((this.stream >>> 24) + "." + (this.stream >> 16 & 0xFF) + "." + (this.stream >> 8 & 0xFF) + "." + (this.stream & 0xFF));
	}

	forEach(callback) {
		this.octets.forEach(callback);
	}
}

class IPv4 {
	constructor(address, netmask) {
		const regex = /^(\d{0,3}\.){3}.(\d{0,3})$|^(\d{0,3}\.){5}.(\d{0,3})$/;
		if (address && typeof address !== "number" && (!address.match(regex) || !netmask.match(regex)))
			throw new Error(`The value '${address}/${netmask}' is no valid address/netmask.`);

		this.address = new OctetStreamIP(address);
		this.netmask = new OctetStreamIP(netmask);
	}


	range() {
		let firstIP     = new IPv4(null, this.netmask.stream);
		let lastIP      = new IPv4(null, this.netmask.stream);

		this.address.octets.forEach((block, index) => {
			firstIP.address.octets.push(parseInt(block) & parseInt(this.netmask.octets[index]));
		});

		firstIP.address.forEach((block, index) => {
			lastIP.address.octets.push(block + (firstIP.netmask.octets[index] ^ 0xFF));
		});

		return [firstIP, lastIP];
	}

	toString() {
		return `${this.address}`;
	}

	static LocalRange() {
		let ip = null;

		for (const iface of Object.values(networkInterfaces())) {
			for (const address of iface) {
				if (address.hasOwnProperty("address") && (address.address.match(/^192\./) || address.address.match(/^10\./))) {
					ip = new IPv4(
						address.address,
						address.netmask
					);
					break;
				}
			}
			if (ip)
				break;
		}

		return ip.range();
	}
}

module.exports = IPv4;
