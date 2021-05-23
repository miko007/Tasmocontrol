import React, {useState, useEffect, useMemo} from "react";

const DevicesListToolBox = ({config}) => {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		window.api.discoveryComplete(() => {
			setLoading(false);
		});
	}, []);

	const disabled = useMemo(() => {
		if (!config)
			return true;
		return typeof config.useCredentials === "undefined" || (config.useCredentials && (!config.tasmotaUser || !config.tasmotaPassword));
	}, [config])

	const refresh = () => {
		window.api.refreshSearch();
		setLoading(true);
	}

	return (
		<>
			<button className="btn btn-warning pull-right" title="Refresh device list" onClick={refresh} disabled={disabled}>
				<span className={`icon icon-cw${loading ? " anim-loading" : ""}`}></span>
			</button>
			<div className="btn-group">
			</div>
		</>
	);
}

export default DevicesListToolBox;
