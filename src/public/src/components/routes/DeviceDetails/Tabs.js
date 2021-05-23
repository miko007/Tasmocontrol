import React from "react";
import {NavLink} from "react-router-dom";

const Tabs = ({device}) => {

	const ip = device?.StatusNET.IPAddress;

	return (
		<div className="tab-group">
			<NavLink exact to={`/device/${ip}`} className="tab-item" activeClassName="active">
				General
			</NavLink>
			<div className="tab-item">
				Network
			</div>
			<NavLink exact to={`/device/${ip}/console`} className="tab-item" activeClassName="active">
				Console
			</NavLink>
		</div>
	);
};

export default Tabs;
