import React, {useState, useCallback, useRef, useEffect, useMemo} from "react";

import "./terminal.scss";

const prepareText = text => {
	return text.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\n/g, "<br />");
}


const greatestCommonDenominator = sortedArray => {
	const first = sortedArray[0];
	const last  = sortedArray[sortedArray.length - 1];

	let i = 0;
	while (i < first.length && first.charAt(i) === last.charAt(i))
		i++;

	return first.substring(0, i);
}

/**
 * TASMOTA Terminal Component
 *
 * all available terminal components for react suck like... a lot, so we took
 * a day to run our own. Its a simple one with autocompletion, history and
 * promise support for commands.
 *
 * @author Michael Ochmann <miko@massivedynamic.eu>
 * @since 0.0.2
 */
const Terminal = ({
			commands,
			motd            = `Tasmocontrol console\n\n`,
			promptColor     = "#f82a71",
			color           = "#eee",
			outputColor     = "#aaa",
			backgroundColor = "#000",
			prompt          = "TASMOTA $",
		}) => {
	const input                 = useRef();
	const end                   = useRef();
	const [lines, setLines]     = useState(["---", prepareText(motd)]);
	const [history, setHistory] = useState([]);
	const [line, setLine]       = useState("");
	const [pointer, setPointer] = useState(0);

	const focus = () => {
		input.current.focus();
	}

	useEffect(() => {
		focus();
	}, []);

	const autoComplete = useCallback(() => {
		const commandsAvailable = Object.keys(cmnds());
		let   matches           = [];

		for (const cmd of commandsAvailable) {
			const regex = new RegExp(`^${line.toLowerCase()}`, "g");
			if (cmd.toLocaleLowerCase().match(regex))
				matches.push(cmd);
		}
		if (matches.length <= 0)
			return;

		matches        = matches.sort((a, b) => a.length - b.length);
		const newLines = [...lines];

		newLines.push(prompt + " " + line);
		newLines.push(matches.join("    "));
		setLines(newLines);

		if (line.length > 2) {
			const closestMatch = greatestCommonDenominator(matches);
			if (closestMatch.length > 2)
				setLine(closestMatch);
		}
	}, [commands, line, lines, prompt]);

	const cmnds = () => {
		return Object.assign({
			clear : () => clear(),
			help  : () => help(),
			motd  : () => clear() && motd
		}, commands);
	};

	const clear = () => {
		setLines([]);

		return " ";
	}

	const help = () => {
		return Object.keys(cmnds()).filter(cmd => cmd !== "").join("\n");
	};


	const historyMove = useCallback(keyCode => {
		if (history.length === 0)
			return;

		let newPointer;

		if (keyCode === "ArrowUp") {
			newPointer = pointer - 1 < 0 ? 0 : pointer - 1;
		} else if (keyCode === "ArrowDown") {
			newPointer =  pointer + 1 >= history.length ? history.length - 1 : pointer + 1;
		}

		setPointer(newPointer);
		setLine(history[newPointer])
	}, [history, pointer]);

	const enter = useCallback(() => {
		if (!commands)
			return;

		if (line === "") {
			setLines(lines => {
				const newLines = [...lines];
				newLines.push(prompt);

				return newLines;
			});

			return;
		}

		setHistory(history => {
			if (line === history[history.length - 1])
				return  history;
			const oldHistory = [...history];
			oldHistory.push(line);
			setPointer(oldHistory.length);
			setLine("");

			return oldHistory;
		});

		const cmd     = line.split(" ")[0]
		const promise = cmnds().hasOwnProperty(cmd) ? cmnds()[cmd](line) : `tasmota: ${cmd}: Command not found.`

		Promise.resolve(promise).then(result => {
			setLines(lines => {
				const oldLines = [...lines];
				oldLines.push(prompt + " " + line);
				oldLines.push(prepareText(result));

				return oldLines;
			});
			setLine("");
		});

	}, [line, prompt, commands])

	const cancel = useCallback(() => {
		setLines(lines => {
			const oldLines = [...lines];
			oldLines.push(prompt + " " + line + "^C");

			return oldLines;
		});

		setLine("");
	}, [line, prompt]);

	const scroll = () => {
		end.current.scrollIntoView({behavior : "smooth"});
	}

	useEffect(() => {
		scroll();
	}, [line, lines]);

	const handleInput = useCallback(event => {

		switch (event.code) {
			case "Enter":
				enter();
				break;
			case "ArrowUp":
				event.preventDefault();
				historyMove(event.code);
				break;
			case "ArrowDown":
				event.preventDefault();
				historyMove(event.code);
				break;
			case "Tab":
				event.preventDefault();
				autoComplete();
				break;
			case "KeyC":
				if (event.ctrlKey)
					cancel();
				break;
			case "KeyL":
				if (event.ctrlKey)
					clear();
				break;
			default:
				scroll();
				return;
		}
	}, [enter, historyMove, autoComplete, cancel]);

	return (
		<section className="terminal" onClick={focus} style={{
			backgroundColor : backgroundColor,
			color           : color
		}}>
			{lines.map((line, index) => {
				return (
					<span className={`line${index === 0 ? " invisible" : ""}`}  style={{color : outputColor}} key={index} dangerouslySetInnerHTML={{__html : line}}>
					</span>
				)
			})}
			<section className="input">
				<span className="prompt" style={{color : promptColor}}>{prompt}&nbsp;</span>
				<input type="text" style={{color : color}} value={line} onChange={event => setLine(event.target.value)} onKeyDown={handleInput} ref={input} />
			</section>
			<div ref={end}><br /></div>
		</section>
	);
};

export default Terminal;
