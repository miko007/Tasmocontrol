import React, {useContext, useCallback} from "react";
import _ from "lodash";

import DeviceContext from "../../../context/DeviceContext";

const MQTT = () => {
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
				<label>MQTT Server</label>
				<input type="text" name="StatusMQT.MqttHost" className="form-control" value={device?.StatusMQT.MqttHost || ""} onChange={handleInput} />
			</p>
			<p className="form-group">
				<label>Port</label>
				<input type="text" name="StatusMQT.MqttPort" className="form-control" value={device?.StatusMQT.MqttPort || ""} onChange={handleInput} />
			</p>
			<p className="form-group">
				<label>Client</label>
				<input type="text" name="StatusMQT.MqttClientMask" className="form-control" value={device?.StatusMQT.MqttClientMask || ""} onChange={handleInput} />
			</p>
			<p className="form-group">
				<label>Topic</label>
				<input type="text" name="Status.Topic" className="form-control" value={device?.Status.Topic || ""} onChange={handleInput} />
			</p>
		</>
	);
};

export default MQTT;
