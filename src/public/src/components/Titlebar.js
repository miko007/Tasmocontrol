import React from "react";

import Toolbar from "./Toolbar";

const Titlebar = ({config}) => {

	const minMax = () => {
		window.api.windowMinMax();
	}

	return (
		<header className="toolbar toolbar-header titlebar" onDoubleClick={minMax}>
			<h1 className="title">Tasmocontrol</h1>
			<Toolbar config={config} />
		</header>
	)
};

export default Titlebar;
