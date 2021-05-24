import React, {useEffect, useContext} from "react";
import {useParams, Switch, Route} from "react-router-dom";

import DeviceContext from "../../context/DeviceContext";

import NothingHere  from "../../shared/NothingHere";
import DeviceSwitch from "../../shared/DeviceSwitch";

import Tabs from "./Tabs";

import General from "./tabs/General";
import Console from "./tabs/Console";

const DeviceDetails = () => {
	const {devices, device, setDevice} = useContext(DeviceContext);
	const {ip} = useParams();

	useEffect(() => {
		setDevice(ip);
	}, [ip, setDevice]);

	if (!ip || !devices || devices.length === 0)
		return <NothingHere text="No device data available" icon="hourglass" />;

	return (
		<section className="wrapper">
			<h4>
				<span className="icon icon-record" style={{color : !device?.alive ? "#fc605b" : "#34c84a", marginRight : "1rem"}}></span> {device?.Status.FriendlyName}
				<DeviceSwitch device={device} />
			</h4>
			<Tabs device={device} />
			<Switch>
				<Route exact path={`/device/:ip`} component={General} />
				<Route path={`/device/:ip/console`} component={Console} />
			</Switch>
		</section>
	);
};

export default DeviceDetails;
