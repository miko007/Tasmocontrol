import {createContext} from "react";

const DeviceContext = createContext({
	devices    : null,
	setDevices : null,
	device     : null,
	setDevice  : null
});

export default DeviceContext;
