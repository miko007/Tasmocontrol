const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
        darkModeChanged : callback => ipcRenderer.on("Tasmocontrol::darkMode", (_, useDarkMode) => callback(useDarkMode)),
        refreshSearch : () => {
            ipcRenderer.send("DeviceStore::search");
        },
        searchUpdated : callback => ipcRenderer.on("DeviceStore::updated", (_, devices) => callback(devices)),
        configUpdated : callback => ipcRenderer.on("ConfigService::changed", (_, config) => callback(config)),
		configRequest : () => ipcRenderer.send("ConfigService::request"),
        configSet     : (key, value) => {
            ipcRenderer.send("ConfigService::set", [key, value]);
        },
        discoveryComplete : callback => ipcRenderer.on("DeviceStore::discoveryComplete", () => callback()),
        deviceRequestAll : () => ipcRenderer.send("DeviceStore::all"),
        deviceRequest : ip => ipcRenderer.send("DeviceStore::single", ip),
        deviceReceive : callback => ipcRenderer.on("DeviceStore::device", (_, device) => callback(device)),
        commandSend : (ip, command, payload) => ipcRenderer.send("CommandService::send", [ip, command, payload]),
        commandImmediate : async (ip, command) => ipcRenderer.invoke("CommandService::sendImmediate", [ip, command]),
        windowMinMax : () => ipcRenderer.send("MainWindow::minMax")
    }
);

contextBridge.exposeInMainWorld("devices", {
        requestAll  : () => ipcRenderer.send("DeviceStore::all"),
        deployTheme : (devices, theme) => ipcRenderer.send("DeviceStore::themeUpdate", [devices, theme])
});
