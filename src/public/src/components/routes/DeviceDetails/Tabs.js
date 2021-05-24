import React, {useContext} from "react";
import {NavLink} from "react-router-dom";

import DeviceContext from "../../context/DeviceContext";

const Tabs = () => {
	const {device} = useContext(DeviceContext);
	const ip       = device?.StatusNET.IPAddress;

	return (
		<div className="tab-group">
			<NavLink exact to={`/device/${ip}`} className="tab-item" activeClassName="active">
				General
			</NavLink>
			<NavLink exact to={`/device/${ip}/mqtt`} className="tab-item" activeClassName="active">
				MQTT
			</NavLink>
			<NavLink exact to={`/device/${ip}/network`} className="tab-item" activeClassName="active">
				Network
			</NavLink>
			<NavLink exact to={`/device/${ip}/console`} className="tab-item" activeClassName="active">
				Console
			</NavLink>
		</div>
	);
};

export default Tabs;
