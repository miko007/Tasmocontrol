import React from "react";

import NothingHere from "../../shared/NothingHere";

const NoCredentials = () => {
	return (
		<NothingHere text={["You have to setup TASMOTA credentials under ", <code key="path">Settings &rarr; Tasmota</code>, " before scanning can begin..."]} icon="lock-open" />
	);
};

export default NoCredentials;
