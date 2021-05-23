import React from "react";

const General = ({device}) => {
	return (
		<pre>
			{JSON.stringify(device, null, 4)}
		</pre>
	);
};

export default General;
