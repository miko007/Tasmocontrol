import React, {useState, useMemo, useContext} from "react";

import DeviceContext from "../../context/DeviceContext";

/**
 * Theme Color assignments as of Tasmota code documentation:
 *
 * #define COLOR_TEXT                  "#000"       // [WebColor1] Global text color - Black
 * #define COLOR_BACKGROUND            "#fff"       // [WebColor2] Global background color - White
 * #define COLOR_FORM                  "#f2f2f2"    // [WebColor3] Form background color - Greyish
 * #define COLOR_INPUT_TEXT            "#000"       // [WebColor4] Input text color - Black
 * #define COLOR_INPUT                 "#fff"       // [WebColor5] Input background color - White
 * #define COLOR_CONSOLE_TEXT          "#000"       // [WebColor6] Console text color - Black
 * #define COLOR_CONSOLE               "#fff"       // [WebColor7] Console background color - White
 * #define COLOR_TEXT_WARNING          "#f00"       // [WebColor8] Warning text color - Red
 * #define COLOR_TEXT_SUCCESS          "#008000"    // [WebColor9] Success text color - Green
 * #define COLOR_BUTTON_TEXT           "#fff"       // [WebColor10] Button text color - White
 * #define COLOR_BUTTON                "#1fa3ec"    // [WebColor11] Button color - Blueish
 * #define COLOR_BUTTON_HOVER          "#0e70a4"    // [WebColor12] Button color when hovered over - Darker blueish
 * #define COLOR_BUTTON_RESET          "#d43535"    // [WebColor13] Restart/Reset/Delete button color - Redish
 * #define COLOR_BUTTON_RESET_HOVER    "#931f1f"    // [WebColor14] Restart/Reset/Delete button color when hovered over - Darker redish
 * #define COLOR_BUTTON_SAVE           "#47c266"    // [WebColor15] Save button color - Greenish
 * #define COLOR_BUTTON_SAVE_HOVER     "#5aaf6f"    // [WebColor16] Save button color when hovered over - Darker greenish
 * #define COLOR_TIMER_TAB_TEXT        "#fff"       // [WebColor17] Config timer tab text color - White
 * #define COLOR_TIMER_TAB_BACKGROUND  "#999"       // [WebColor18] Config timer tab background color - Light grey
 */
const Themes = [
	{
		name   : "Dark",
		colors : ["#eaeaea","#252526","#4f4f4f","#000000","#dddddd","#65c115","#1f1f1f","#ff5661","#008000","#faffff","#1fa3ec","#0e70a4","#d43535","#931f1f","#47c266","#5aaf6f","#faffff","#999999","#eaeaea"]
	},
	{
		name   : "Light",
		colors : ["#000000","#ffffff","#f2f2f2","#000000","#ffffff","#000000","#ffffff","#ff0000","#008000","#ffffff","#1fa3ec","#0e70a4","#d43535","#931f1f","#47c266","#5aaf6f","#ffffff","#999999","#000000"]
	},
	{
		name   : "Halloween",
		colors : ["#cccccc","#2f3133","#3d3f41","#dddddd","#293134","#ffb000","#293134","#ff5661","#008000","#ffffff","#ec7600","#bf5f00","#d43535","#931f1f","#47c266","#5aaf6f","#ffffff","#999999","#bc4d90"]
	},
	{
		name   : "Navy",
		colors : ["#e0e0c0","#000033","#4f4f4f","#000000","#dddddd","#a7f432","#1e1e1e","#ff0000","#008000","#ffffff","#1fa3ec","#0e70a4","#d43535","#931f1f","#47c266","#5aaf6f","#ffffff","#999999","#eedd77"]
	},
	{
		name   : "Purple Rain",
		colors : ["#eaeaea","#252525","#282531","#eaeaea","#282531","#d7ccff","#1d1b26","#ff5661","#008000","#faffff","#694fa8","#4d3e7f","#b73d5d","#822c43","#1f917c","#156353","#faffff","#716b7f","#eaeaea"]
	}
];

const Theme = () => {
	const {devices}                         = useContext(DeviceContext);
	const [selectedTheme, setSelectedTheme] = useState(0);

	const select = event => {
		setSelectedTheme(event.target.value);
	}

	const colors = useMemo(() => {
		if (!selectedTheme || selectedTheme < 0)
			return Array(19).fill("");

		return Themes[selectedTheme].colors;
	}, [selectedTheme]);

	return (
		<section className="wrapper themesTab">
			<section className="selector">
				<section>
					<p className="form-group">
						<label>Preset</label>
						<select className="form-control" value={selectedTheme} onChange={select}>
							{Themes.map((theme, index) => <option value={index} key={index}>{theme.name}</option>)}
						</select>
					</p>
					<ul className="list-group small">
						{Object.values(devices).map((device, index) => {
							return (
								<li className="list-group-item" key={index}>
									<input type="checkbox" id={`dev_${index}`} />
									<label htmlFor={`dev_${index}`}>{device.Status.FriendlyName}</label>
								</li>
							);
						})}
					</ul>
					<p>
						<button className="btn btn-warning btn-large pull-right">update all</button>
					</p>
				</section>
				<section className="preview" style={{color: colors[0], background: colors[1]}}>
					<h3>Sonoff Basic</h3>
					<h2>my-fancy-tasmota-device</h2>
					<div className="state">OFF</div>
					<button style={{color : colors[9], background : colors[10]}} disabled>On/Off</button>
					<button style={{color : colors[9], background : colors[10]}}  disabled>Settings</button>
					<button style={{color : colors[9], background : colors[10]}}  disabled>Information</button>
					<button style={{color : colors[9], background : colors[10]}}  disabled>Firmware Update</button>
					<button style={{color : colors[9], background : colors[10]}}  disabled>Console</button>
					<button style={{color : colors[9], background : colors[12]}} disabled>Restart</button>
				</section>
			</section>
		</section>
	);
};

export default Theme;
