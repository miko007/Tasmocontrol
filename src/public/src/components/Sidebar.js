import React, {useCallback} from "react";

import {NavLink} from "react-router-dom";

const Sidebar = ({width, resize, devices}) => {
	const mouseMove = useCallback(event => {
		const x = event.clientX + 1;

		if (x <= 200)
			return;

		const vw = x * 100 / document.body.clientWidth;

		resize(vw);
	}, [resize]);

	const mouseUp = useCallback(() => {
		window.removeEventListener("mousemove", mouseMove);
		window.removeEventListener("mouseup", mouseUp);
	}, [mouseMove]);

	const mouseDown = useCallback(() => {
		window.addEventListener("mousemove", mouseMove);
		window.addEventListener("mouseup", mouseUp);
	}, [mouseMove, mouseUp]);

	return (
		<aside className="sidebar main" style={{width : `${width}vw`}}>
			<section className="nav-group">
				<h5 className="nav-group-title">Favorites</h5>
				<NavLink exact to="/" className="nav-group-item" activeClassName="active">
					<span className="icon icon-home"></span>
					Device List
				</NavLink>
				<NavLink exact to="/settings" className="nav-group-item" activeClassName="active">
					<span className="icon icon-cog"></span>
					Settings
				</NavLink>
			</section>
			<section className="nav-group">
				<h5 className="nav-group-title">Devices</h5>
				{Object.values(devices).map(device => {
					return (
						<span className="nav-group-item" key={device.Status.DeviceName}>
							<span className="icon icon-record" style={{color : device.Status.Power === 0 ? "#ccc" : "#fdbc40"}}></span>
							{device.Status.FriendlyName}
						</span>
					);
				})}
			</section>
			<div className="handle" onMouseDown={() => mouseDown()}></div>
		</aside>
	);
};

export default Sidebar;
