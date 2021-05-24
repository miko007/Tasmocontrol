import React, {useCallback, useState, useEffect, useContext} from "react";

import DeviceContext from "../context/DeviceContext";

const DeviceSwitch = ({device}) => {
	const {devices, setDevices} = useContext(DeviceContext);
	const [power, setPower]     = useState(false);

	useEffect(() => {
		if (!device)
			return;

		setPower(device.Status.Power === 1);
	}, [device]);

	const switchDevice = useCallback(() => {
		if (!device)
			return;
		const newDevices = {...devices};
		const power      = device?.Status.Power === 1 ? 0 : 1;

		if (!newDevices.hasOwnProperty(device.StatusNET.IPAddress))
			return;
		setPower(power);
		newDevices[device?.StatusNET.IPAddress].Status.Power = power;
		setDevices(newDevices);

		window.api.commandSend(device?.StatusNET.IPAddress, "Power", power);
	}, [devices, setDevices, device]);

	return (
		<>
			<label className="form-switch pull-right" style={{verticalAlign : "middle"}}>
				<input type="checkbox" name="switch" checked={power} onChange={switchDevice} />
				<i></i>
			</label>
		</>
	);
};

export default DeviceSwitch;
