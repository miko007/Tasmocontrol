import React, {useContext} from "react";

import {NavLink} from "react-router-dom";

import DeviceContext from "../../context/DeviceContext";

const DeviceDetailsToolBar = ({config}) => {
	const {sendChanges} = useContext(DeviceContext);

	return (
		<>
			<NavLink to="/" className="btn btn-default" title="Back to list">
				<span className="icon icon-left-open"></span>
				Back
			</NavLink>
			<button className="btn btn-primary pull-right" onClick={sendChanges}>
				<span className="icon icon-floppy"></span>
			</button>
		</>
	);
}

export default DeviceDetailsToolBar;
