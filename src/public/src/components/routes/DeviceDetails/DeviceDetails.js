import React, {useMemo} from "react";
import {useParams, Switch, Route} from "react-router-dom";

import NothingHere  from "../../shared/NothingHere";
import DeviceSwitch from "../../shared/DeviceSwitch";

import Tabs from "./Tabs";

import General from "./tabs/General";
import Console from "./tabs/Console";

const DeviceDetails = ({devices, setDevices}) => {
	const {ip} = useParams();

	const device = useMemo(() => {
		if (!devices || !ip || !devices.hasOwnProperty(ip))
			return null;

		return devices[ip];
	}, [devices, ip]);

	if (!ip || !devices)
		return <NothingHere text="No device data available" icon="hourglass" />;

	return (
		<section className="wrapper">
			<h4>
				<span className="icon icon-record" style={{color : !device?.alive ? "#fc605b" : "#34c84a", marginRight : "1rem"}}></span> {device?.Status.FriendlyName}
				<DeviceSwitch device={device} devices={devices} setDevices={setDevices} />
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
