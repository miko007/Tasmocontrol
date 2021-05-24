import React, {useState, useCallback, useEffect, useContext} from "react";

import DeviceContext from "../../../context/DeviceContext";

const General = ({device}) => {
	const {devices, setDevices}   = useContext(DeviceContext);
	const [formData, setFormData] = useState({
		FriendlyName : "",
		DeviceName   : ""
	});

	const save = useCallback(async () => {
		if (!device)
			return;

		const res = await window.api.commandImmediate(device.StatusNET.IPAddress, `FriendlyName ${formData.FriendlyName}`);
		new Notification(`Update`, {body : `Device has been changed`});
		console.log(device.StatusNET.IPAddress, res);
	}, [formData, device]);

	useEffect(() => {
		if (!device)
			return;
		setFormData({
			FriendlyName : device.Status.FriendlyName,
			DeviceName   : device.Status.DeviceName
		});


	}, [device]);

	const handleInput = useCallback(event => {
		if (!device)
			return;

		const newData = {...formData};
		newData[event.target.name] = event.target.value;
		setFormData(newData);
	}, [device, formData]);

	return (
		<>
			<p className="form-group">
				<label>Device Name</label>
				<input type="text" name="DeviceName" className="form-control" value={formData.DeviceName} onChange={handleInput} />
			</p>
			<p className="form-group">
				<label>Friendly Name</label>
				<input type="text" name="FriendlyName" className="form-control" value={formData.FriendlyName} onChange={handleInput} />
			</p>
			<pre>
				{JSON.stringify(device, null ,4)}
			</pre>
		</>
	);
};

export default General;
