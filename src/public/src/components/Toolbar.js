import React           from "react";
import {Switch, Route} from "react-router-dom";

import DevicesListToolbar   from "./routes/DevicesList/DevicesListToolbar";
import SettingsToolbar      from "./routes/Settings/SettingsToolbar";
import DeviceDetailsToolBar from "./routes/DeviceDetails/DeviceDetailsToolbar";

const Toolbar = ({config}) => {

	return (
		<section className="toolbar-actions mainToolbar">
			<span className="btn" style={{height: "24px", display : "inline-block", margin : "0", padding : "0"}}></span>
			<Switch>
				<Route exact path="/" render={() => <DevicesListToolbar config={config} />} />
				<Route path="/settings" render={() => <SettingsToolbar config={config} />} />
				<Route exact path="/device/:id" render={() => <DeviceDetailsToolBar config={config} />} />
			</Switch>
		</section>
	);
};

export default Toolbar;
