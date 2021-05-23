import React from "react";

import {NavLink} from "react-router-dom";

const DeviceDetailsToolBar = ({config}) => {
	return (
		<>
			<NavLink to="/" className="btn btn-default" title="Back to list">
				<span className="icon icon-left-open"></span>
				Back
			</NavLink>
		</>
	);
}

export default DeviceDetailsToolBar;
