import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import _ from "lodash";

import Terminal from "../../../shared/terminal/Terminal";

import Commands from "../../../../assets/commands.json";
import {version} from "../../../../electron.json";

const Console = () => {
	const {ip} = useParams();
	const [commands, setCommands] = useState({
		whoami : () => "MikO",
	});

	useEffect(() => {
		setCommands(oldCommands => {
			const newCommands = _.clone(oldCommands);

			for (const command of Commands)
				newCommands[command.value] = async line => {
					const result = await window.api.commandImmediate(ip, line);

					return JSON.stringify(result);
				};

			return newCommands;
		});
	}, [ip]);

	return (
		<section style={{display: "flex"}}>
			<Terminal
				color="#eee"
				commands={commands}
				motd={`Tasmocontrol v${version}\nCommand console\n\nDevice: ${ip}\n\n`}
				promptColor="#f82a71"
				backgroundColor="#222"
				outputColor="#aaa"
				prompt="TASMOTA $"
			/>
		</section>
	);
};

export default Console;
