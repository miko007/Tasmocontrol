import React, {useState} from "react";

const Application = ({config}) => {
	const [interval, setInterval] = useState(config.interval ?? 2);

	const changeInterval = event => {
		setInterval(event.target.value);
		window.api.configSet("interval", event.target.value);
	}

	return (
		<>
			<h5>Discovery</h5>
			<form>
				<div className="form-group">
					<label>Refresh interval <small><i>(seconds)</i></small></label>
					<input type="number" step="1" min="2" className="form-control" placeholder="2" value={interval} onChange={changeInterval} />
				</div>
			</form>
		</>
	);
};

export default Application;
