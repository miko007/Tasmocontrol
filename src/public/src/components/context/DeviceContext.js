import {createContext} from "react";

const DeviceContext = createContext({
	devices      : null,
	setDevices   : null,
	device       : null,
	setDevice    : null,
	sendChanges  : null,
	updateDevice : null,
	isSaving     : false
});

export default DeviceContext;
