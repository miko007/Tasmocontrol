import React, {useEffect, useState, useCallback} from "react";
import axios from "axios";

import NothingHere         from "../../shared/NothingHere";
import DeviceSelectionList from "../../shared/DeviceSelectionList";

const Firmware = () => {
	const [selectedDevices, setSelectedDevices]   = useState([]);
	const [selectedFirmware, setSelectedFirmware] = useState(null);
	const [selectedBuild, setSelectedBuild]       = useState(null);
	const [releases, setReleases]                 = useState([]);
	const [assets, setAssets]                     = useState([]);
	const [ready, setReady]                       = useState(false);

	useEffect(() => {
		axios.get(`https://api.github.com/repos/arendst/tasmota/releases`).then(response => {
			setReleases(response.data);
			setReady(true);
		}).catch(error => {
			new Notification("Error", {body : `Could not gather release info: ${error}`});
		});
	}, []);

	useEffect(() => {
		if (!selectedFirmware)
			return;
		axios.get(selectedFirmware.assets_url).then(response => {
			setAssets(response.data);
		}).catch(error => {
			new Notification("Error", {body : `Could not gather assets info: ${error}`});
		});
	}, [selectedFirmware]);

	const selectFW = useCallback(event => {
		if (releases.length === 0)
			return;

		for (const release of releases) {
			if (release.tag_name === event.target.value) {
				setSelectedFirmware(release);

				return;
			}
		}
	}, [releases]);

	const selectBuild = useCallback(event => {
		if (assets.length === 0)
			return;

		for (const asset of assets) {
			if (asset.node_id === event.target.value) {
				setSelectedBuild(asset);

				return;
			}
		}
	}, [assets]);

	if (!ready)
		return <NothingHere icon="globe" text="Release information not ready..." />

	return (
		<section className="wrapper">
			<h3>Firmware</h3>
			<p className="form-group">
				<label>Release</label>
				<select className="form-control" onChange={selectFW} value={selectedFirmware ? selectedFirmware.tag_name : ""}>
					<option value="" disabled>Select release...</option>
					{releases.map(release => <option key={release.node_id} value={release.tag_name}>{release.tag_name}</option>)}
				</select>
			</p>
			<p className="form-group">
				<label>Version</label>
				<select className="form-control" onChange={selectBuild} value={selectedBuild ? selectedBuild.node_id : ""}>
					<option value="" disabled>Select build...</option>
					{assets.map(asset => <option key={asset.node_id} value={asset.node_id}>{asset.name}</option>)}
				</select>
			</p>
			<br />
			<div className="form-group">
				<label>Devices to update</label>
				<DeviceSelectionList selectedDevices={selectedDevices} setSelectedDevices={setSelectedDevices} showVersion={true} />
			</div>
		</section>
	);
};

export default Firmware;
