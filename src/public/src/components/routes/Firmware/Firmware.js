import React, {useEffect, useState, useContext} from "react";
import axios from "axios";

import DeviceContext from "../../context/DeviceContext";

import NothingHere         from "../../shared/NothingHere";
import DeviceSelectionList from "../../shared/DeviceSelectionList";

const Firmware = () => {
	const {devices}                             = useContext(DeviceContext);
	const [selectedDevices, setSelectedDevices] = useState([]);
	const [releases, setReleases]               = useState([]);
	const [ready, setReady]                     = useState(false);

	useEffect(() => {
		axios.get(`https://api.github.com/repos/arendst/tasmota/releases`).then(response => {
			setReleases(response.data);
			setReady(true);
		}).catch(error => {
			new Notification("Error", {body : `Could not gather release info: ${error}`});
		});
	}, []);

	if (!ready)
		return <NothingHere icon="globe" text="Release information not ready..." />

	return (
		<section className="wrapper">
			<h3>Firmware</h3>
			<p className="form-group">
				<label>Release</label>
				<select className="form-control">
					{releases.map(release => <option value={release.tag_name}>{release.tag_name}</option>)}
				</select>
			</p>
			<br />
			<p className="form-group">
				<label>Devices to update</label>
				<DeviceSelectionList selectedDevices={selectedDevices} setSelectedDevices={setSelectedDevices} showVersion={true} />
			</p>
		</section>
	);
};

export default Firmware;
