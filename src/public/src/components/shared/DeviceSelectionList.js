import React, {useContext, useCallback} from "react";

import DeviceContext from "../context/DeviceContext";

const DeviceSelectionList = ({selectedDevices, setSelectedDevices, showVersion = false}) => {
	const {devices} = useContext(DeviceContext);

	const selectDevice = useCallback(event => {
		const newDevices = [...selectedDevices];
		const ip         = event.target.name;
		const index      = newDevices.indexOf(ip)

		if (index < 0)
			newDevices.push(ip);
		else
			newDevices.splice(index, 1);
		setSelectedDevices(newDevices);
	}, [selectedDevices, setSelectedDevices]);

	return (
		<ul className="list-group small">
			{Object.values(devices).map((device, index) => {
				return (
					<li className="list-group-item" key={index}>
						<input type="checkbox" id={`dev_${index}`} name={device.StatusNET.IPAddress} checked={selectedDevices.indexOf(device.StatusNET.IPAddress) >= 0} onChange={selectDevice} />
						<label htmlFor={`dev_${index}`}>
							{device.Status.FriendlyName}
							{showVersion ? <i style={{opacity: 0.4}}>&nbsp;(v{device.StatusFWR.Version.replace(/\(.*\)/, "")})</i> : ""}
						</label>
					</li>
				);
			})}
		</ul>
	);
};

export default DeviceSelectionList;
