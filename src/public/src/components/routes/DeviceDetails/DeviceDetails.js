import React, {useEffect, useState, useCallback} from "react";
import {useParams} from "react-router-dom";

import NothingHere from "../../shared/NothingHere";

const DeviceDetails = () => {
	const {ip} = useParams();
	const [device, setDevice] = useState(null);

	useEffect(() => {
		if (!ip)
			return;

		window.api.deviceReceive(device => setDevice(device));
		window.api.deviceRequest(ip);
	}, [ip]);

	const switchDevice = useCallback(() => {
		if (!device)
			return;
		const newDevice = {...device};
		const power     = device.Status.Power === "0" ? "1" : "0";
		newDevice.Status.Power = power;
		setDevice(newDevice);

		window.api.commandSend(device.StatusNET.IPAddress, "Power", power);
	}, [device]);

	if (!device)
		return <NothingHere text="No device data available" icon="hourglass" />;

	return (
		<section className="wrapper">
			<h4>
				<span className="icon icon-record"></span> {device.Status.FriendlyName}
				<label className="form-switch pull-right" style={{verticalAlign : "middle"}}>
					<input type="checkbox" name="useCredentials" checked={device.Status.Power !== "0"} onChange={switchDevice} />
					<i></i>
				</label>
			</h4>
			<pre>
				{JSON.stringify(device, null, 4)}
			</pre>
		</section>
	);
};

export default DeviceDetails;
