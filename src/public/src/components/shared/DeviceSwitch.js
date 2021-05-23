import React, {useCallback, useState, useEffect} from "react";

const DeviceSwitch = ({devices, setDevices, device}) => {
	const [power, setPower] = useState(false);

	useEffect(() => {
		if (!device)
			return;

		setPower(device.Status.Power === 1);
	}, [device]);

	const switchDevice = useCallback(() => {
		const newDevices = {...devices};
		const power      = device?.Status.Power === 1 ? 0 : 1;

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
