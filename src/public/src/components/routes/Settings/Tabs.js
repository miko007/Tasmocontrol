import React from "react";
import {NavLink} from "react-router-dom";

const Tabs = () => {
	return (
		<div className="tab-group">
			<NavLink exact to="/settings" className="tab-item" activeClassName="active">
				Application
			</NavLink>
			<NavLink exact to="/settings/tasmota" className="tab-item" activeClassName="active">
				Tasmota
			</NavLink>
			<NavLink exact to="/settings/network" className="tab-item" activeClassName="active">
				Network
			</NavLink>
		</div>
	);
};

export default Tabs;
