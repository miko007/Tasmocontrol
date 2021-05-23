import React, {useEffect, useState} from "react";

import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";

import Titlebar   from "./Titlebar";
import Sidebar    from "./Sidebar";

import DevicesList   from "./routes/DevicesList/DevicesList";
import DeviceDetails from "./routes/DeviceDetails/DeviceDetails";
import Settings      from "./routes/Settings/Settings";

const App = () => {
	const [config, setConfig]             = useState({});
	const [devices, setDevices]           = useState([]);
	const [device, setDevice]             = useState(null);
	const [sidebarWidth, setSidebarWidth] = useState(30);

	useEffect(() => {
		window.api.searchUpdated(devices => {
			setDevices(devices);
		});
		window.api.configUpdated(newConfig =>  {
			setConfig(newConfig)
		});
		window.api.deviceRequestAll();
		window.api.configRequest();

		console.log(device);
	}, [device]);

	const handleInput = event => {
		const newConfig = {...config};
		const value     = event.target.type === "checkbox" ? event.target.checked : event.target.value;

		newConfig[event.target.name] = value;
		setConfig(newConfig);
	}

	return (
		<Router>
			<section className="mainWindow">
				<Titlebar config={config} />
				<main className="app">
					<Sidebar width={sidebarWidth} resize={setSidebarWidth} devices={devices} />
					<section className="content" style={{width : `${100 - sidebarWidth}vw`}}>
						<Switch>
							<Route path="/device/:ip" render={() => <DeviceDetails devices={devices} setDevices={setDevices} />} />
							<Route exact path="/" render={() => <DevicesList devices={devices} setDevice={setDevice} config={config} setDevices={setDevices} />} />
							<Route path="/settings" render={() => <Settings config={config} setConfig={handleInput} />} />
							<Route render={() => <Redirect to="/"/>}/>
						</Switch>
					</section>
				</main>
			</section>
		</Router>
	)
}

export default App;
