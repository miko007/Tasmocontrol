import React, {useCallback, useContext} from "react";
import _ from "lodash";

import DeviceContext from "../../../context/DeviceContext";

const General = () => {
	const {device, updateDevice} = useContext(DeviceContext);

	const handleInput = useCallback(event => {
		if (!device)
			return;

		const newDevice = {...device};
		_.set(newDevice, event.target.name, event.target.value);
		updateDevice(newDevice);
	}, [device]);

	return (
		<>
			<p className="form-group">
				<label>Device Name</label>
				<input type="text" name="Status.DeviceName" className="form-control" value={device?.Status.DeviceName || ""} onChange={handleInput} />
			</p>
			<p className="form-group">
				<label>Friendly Name</label>
				<input type="text" name="Status.FriendlyName" className="form-control" value={device?.Status.FriendlyName || ""} onChange={handleInput} />
			</p>
			<pre>
				{JSON.stringify(device, null ,4)}
			</pre>
		</>
	);
};

export default General;
