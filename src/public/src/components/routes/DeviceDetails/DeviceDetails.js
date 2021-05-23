import React, {useEffect, useState, useMemo, useCallback} from "react";
import {useParams, Switch, Route} from "react-router-dom";

import NothingHere from "../../shared/NothingHere";

import Tabs from "./Tabs";

import General from "./tabs/General";
import Console from "./tabs/Console";

const DeviceDetails = ({devices, setDevices}) => {
	const {ip} = useParams();
	const [power, setPower] = useState(false);

	const device = useMemo(() => {
		if (!devices || !ip || !devices.hasOwnProperty(ip))
			return null;

		return devices[ip];
	}, [devices, ip]);

	const switchDevice = useCallback(() => {
		const newDevices = {...devices};
		const power      = device?.Status.Power === 1 ? 0 : 1;

		setPower(power);
		newDevices[ip].Status.Power = power;
		setDevices(newDevices)

		window.api.commandSend(ip, "Power", power);
	}, [devices, setDevices, device, ip]);

	useEffect(() => {
		if (!device)
			return;

		setPower(device.Status.Power === 1);
	}, [device]);

	if (!ip || !devices)
		return <NothingHere text="No device data available" icon="hourglass" />;

	return (
		<section className="wrapper">
			<h4>
				<span className="icon icon-record"></span> {device?.Status.FriendlyName}
				<label className="form-switch pull-right" style={{verticalAlign : "middle"}}>
					<input type="checkbox" name="useCredentials" checked={power} onChange={switchDevice} />
					<i></i>
				</label>
			</h4>
			<Tabs device={device} />
			<Switch>
				<Route exact path={`/device/:ip`} render={() => <General device={device} />} />
				<Route path={`/device/:ip/console`} render={() => <Console device={device} />} />
			</Switch>
		</section>
	);
};

export default DeviceDetails;
