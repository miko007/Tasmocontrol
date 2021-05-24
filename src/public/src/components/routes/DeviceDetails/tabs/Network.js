import React, {useContext} from "react";

import DeviceContext from "../../../context/DeviceContext";

const Network = () => {
	const {device} = useContext(DeviceContext);

	return (
		<>
			<p className="form-group">
				<label>IP</label>
				<input type="text" name="StatusNET.IPAddress" className="form-control" value={device?.StatusNET.IPAddress || ""} readOnly disabled />
			</p>
			<p className="form-group">
				<label>Subnetmask</label>
				<input type="text" name="StatusNET.Subnetmask" className="form-control" value={device?.StatusNET.Subnetmask || ""} readOnly disabled />
			</p>
			<p className="form-group">
				<label>SSID</label>
				<input type="text" name="StatusLOG.SSId" className="form-control" value={device?.StatusLOG.SSId[0] || ""} readOnly disabled />
			</p>
		</>
	);
};

export default Network;
