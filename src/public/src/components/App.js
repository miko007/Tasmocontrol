import React, {useEffect, useState, useCallback} from "react";

import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import _ from "lodash";

import DeviceContext from "./context/DeviceContext";

import Titlebar   from "./Titlebar";
import Sidebar    from "./Sidebar";

import DevicesList   from "./routes/DevicesList/DevicesList";
import DeviceDetails from "./routes/DeviceDetails/DeviceDetails";
import Settings      from "./routes/Settings/Settings";

import SaveTasmota from "../SaveTasmota";

const App = () => {
	const [config, setConfig]             = useState({});
	const [devices, setDevices]           = useState([]);
	const [device, setDevice]             = useState(null);
	const [sidebarWidth, setSidebarWidth] = useState(30);
	const [isSaving, setIsSaving]         = useState(false);

	useEffect(() => {
		window.api.searchUpdated(devices => {
			setDevices(devices);
		});
		window.api.configUpdated(newConfig =>  {
			setConfig(newConfig)
		});
		window.devices.requestAll();
		window.api.configRequest();
	}, []);

	const setDeviceObject = useCallback((ip = null) => {
		const localDevices = {...devices}

		if (!ip)
			setDevice(oldDevice => oldDevice === null || typeof oldDevice === "undefined" ? null : _.cloneDeep(localDevices[oldDevice.StatusNET.IPAddress]));
		else
			setDevice(localDevices.hasOwnProperty(ip) ? _.cloneDeep(localDevices[ip]) : null);
	}, [devices]);

	useEffect(() => {
		setDeviceObject();
	}, [devices, setDeviceObject]);

	const handleInput = event => {
		const newConfig = {...config};
		const value     = event.target.type === "checkbox" ? event.target.checked : event.target.value;

		newConfig[event.target.name] = value;
		setConfig(newConfig);
	}

	const sendChanges = useCallback(() => {
		SaveTasmota(devices, setDevices, device, isSaving, setIsSaving);
	}, [device, setDevices, devices, isSaving, setIsSaving]);

	return (
		<DeviceContext.Provider value={{
			devices,
			setDevices,
			device,
			sendChanges,
			isSaving,
			setIsSaving,
			setDevice    : setDeviceObject,
			updateDevice : setDevice
		}}>
			<Router>
				<section className="mainWindow">
					<Titlebar config={config} />
					<main className="app">
						<Sidebar width={sidebarWidth} resize={setSidebarWidth} />
						<section className="content" style={{width : `${100 - sidebarWidth}vw`}}>
							<Switch>
								<Route path="/device/:ip" render={() => <DeviceDetails />} />
								<Route exact path="/" render={() => <DevicesList config={config} />} />
								<Route path="/settings" render={() => <Settings config={config} setConfig={handleInput} />} />
								<Route render={() => <Redirect to="/"/>}/>
							</Switch>
						</section>
					</main>
				</section>
			</Router>
		</DeviceContext.Provider>
	)
}

export default App;
