import React from "react";

import Toolbar from "./Toolbar";

const Titlebar = ({config}) => {
	return (
		<header className="toolbar toolbar-header titlebar">
			<h1 className="title">Tasmocontrol</h1>
			<Toolbar config={config} />
		</header>
	)
};

export default Titlebar;
