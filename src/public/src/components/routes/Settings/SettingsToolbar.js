import React, {useCallback} from "react";

const SettingsToolbar = ({config}) => {
	const save = useCallback(() => {
		if (!config)
			return;

		for (const key of Object.keys(config)) {
			window.api.configSet(key, config[key]);
		}
	}, [config]);

	return (
		<>
			<button className="btn btn-primary pull-right" title="Save settings" onClick={save}>
				<span className={`icon icon-floppy`}></span>
			</button>
		</>
	);
};

export default SettingsToolbar;
