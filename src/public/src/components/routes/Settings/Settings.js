import React from "react";
import {Switch, Route} from "react-router-dom";

import Tabs from "./Tabs";

import Application from "./tabs/Application";
import Tasmota     from "./tabs/Tasmota";

const Settings = ({config, setConfig}) => {
	return (
		<>
			<Tabs />
			<section className="wrapper">
				<Switch>
					<Route exact path="/settings" render={() => <Application config={config} />} />
					<Route exact path="/settings/tasmota" render={() => <Tasmota config={config} setConfig={setConfig} />} />
				</Switch>
			</section>
		</>
	);
};

export default Settings;
