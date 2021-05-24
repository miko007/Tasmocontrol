import React, {useContext} from "react";

import {NavLink} from "react-router-dom";

import DeviceContext from "../../context/DeviceContext";

import NothingHere  from "../../shared/NothingHere";
import DeviceSwitch from "../../shared/DeviceSwitch";

import NoCredentials from "./NoCredentials";

const DevicesList = ({config}) => {
	const {devices, setDevices} = useContext(DeviceContext);
	if (typeof config.useCredentials === "undefined" || (config.useCredentials && (!config.tasmotaUser || !config.tasmotaPassword)))
		return <NoCredentials />


	if (devices.length === 0)
		return <NothingHere text="No Devices detected yet" />

	return (
		<ul className="list-group">
			{Object.values(devices).map(device => (
				<li className="list-group-item" key={device.Status.DeviceName}>
					<span className="icon icon-mobile pull-left media-object" style={{fontSize : "1.2rem"}}></span>
					<div className="media-body">
						<strong>{device.Status.FriendlyName[0]}</strong><br />
						<small>{device.StatusNET.IPAddress}</small><br />
						<span className="icon icon-record" style={{color : !device.alive ? "#fc605b" : "#34c84a", marginRight : "0.5rem"}}></span>
						{device.StatusFWR.Version.replace(/\(.*\)/, "")}
						<section className="additional-controls">
							<NavLink to={`/device/${device.StatusNET.IPAddress}`}>
								<button className="btn">
									<i className="icon icon-info-circled"></i>
								</button>
							</NavLink>
							<DeviceSwitch devices={devices} setDevices={setDevices} device={device} />
						</section>
					</div>
				</li>
			))}
		</ul>
	);
};

export default DevicesList;
