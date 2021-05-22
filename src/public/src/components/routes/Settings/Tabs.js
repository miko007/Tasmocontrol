import React from "react";
import {NavLink} from "react-router-dom";

const Tabs = () => {
	return (
		<div className="tab-group">
			<NavLink exact to="/settings" className="tab-item" activeClassName="active">
				Application
			</NavLink>
			<div className="tab-item">
				Network
			</div>
			<NavLink exact to="/settings/tasmota" className="tab-item" activeClassName="active">
				Tasmota
			</NavLink>
		</div>
	);
};

export default Tabs;
