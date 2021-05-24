import React from "react";

import {NavLink} from "react-router-dom";

const DeviceDetailsToolBar = ({config}) => {
	return (
		<>
			<NavLink to="/" className="btn btn-default" title="Back to list">
				<span className="icon icon-left-open"></span>
				Back
			</NavLink>
			<button className="btn btn-primary pull-right" onClick={() => {
				const event = new Event("Details::save");
				window.dispatchEvent(event);
			}}>
				<span className="icon icon-floppy"></span>
			</button>
		</>
	);
}

export default DeviceDetailsToolBar;
