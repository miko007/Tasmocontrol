import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import Terminal from "../../../shared/terminal/Terminal";
import TasmocontrolInfo from "../../../../../package.json";

import Commands from "../../../../assets/commands.json";

const Console = ({device}) => {
	const {ip} = useParams();
	const [commands, setCommands] = useState({
		whoami : () => "MikO",
	});

	useEffect(() => {
		setCommands(oldCommands => {
			for (const command of Commands)
				oldCommands[command.value] = async line => {
					const result = await window.api.commandImmediate(ip, line);

					return JSON.stringify(result);
				};

			return oldCommands;
		});
	}, [ip]);

	return (
		<section style={{display: "flex"}}>
			<Terminal
				hideTopBar={true}
				showAction={false}
				allowTabs={false}
				color="#eee"
				commands={commands}
				motd={`Tasmocontrol v${TasmocontrolInfo.version}\nCommand console\n\nDevice: ${ip}\n\n`}
				promptColor="#f82a71"
				backgroundColor="#222"
				outputColor="#aaa"
				prompt="TASMOTA $"
			/>
		</section>
	);
};

export default Console;
