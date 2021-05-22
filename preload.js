const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
        send : (channel, data) => {
            ipcRenderer.send(channel, data);
        },
        receive   : (channel, func) => {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        },
        refreshSearch : () => {
            ipcRenderer.send("DeviceStore::search");
        },
        searchUpdated : callback => ipcRenderer.on("DeviceStore::updated", (_, devices) => callback(devices)),
        configUpdated : callback => ipcRenderer.on("ConfigService::changed", (_, config) => callback(config)),
		configRequest : () => ipcRenderer.send("ConfigService::request"),
        configSet     : (key, value) => {
            ipcRenderer.send("ConfigService::set", [key, value]);
        },
        discoveryComplete : callback => ipcRenderer.on("DeviceStore::discoveryComplete", () => callback())
    }
);
