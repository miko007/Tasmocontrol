import React from "react";

const DeviceDetails = ({device}) => {
	return (
		<>
			{device?.alive}
		</>
	);
};

export default DeviceDetails;
