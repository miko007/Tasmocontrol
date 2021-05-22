import React, {useEffect} from "react";

const Tasmota = ({config, setConfig}) => {

	useEffect(() => {
		if (!config)
			return;
		if (typeof config.useCredentials === "undefined") {
			setConfig({
				target : {
					name    : "useCredentials",
					type    : "checkbox",
					checked : true
				}
			});
		}
	}, [config]);

	return (
		<>
			<h5>Basic Auth</h5>
			<form>
				<div className="form-group">
					<label>use Authentication</label><br />
					<label className="form-switch">
						<input type="checkbox" name="useCredentials" checked={config.useCredentials ?? true} onChange={setConfig} />
						<i></i>
					</label>
				</div>
				<div className="form-group">
					<label>Username</label>
					<input type="text" className="form-control" placeholder="admin..." name="tasmotaUser" value={config.tasmotaUser} onChange={setConfig} />
				</div>
				<div className="form-group">
					<label>Password</label>
					<input type="password" className="form-control" name="tasmotaPassword" placeholder="password..." value={config.tasmotaPassword} onChange={setConfig} />
				</div>
			</form>
		</>
	);
};

export default Tasmota;
