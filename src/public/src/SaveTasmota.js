const SaveTasmota = (devices, setDevices, device, isSaving, setIsSaving) => {
	if (!devices || !device || isSaving)
		return;

	setIsSaving(true);
	const oldDevices = {...devices};
	const ip         = device.StatusNET.IPAddress;
	const prevState  = {...oldDevices[ip]};
	const promises   = [];

	if (device.Status.FriendlyName !== prevState.Status.FriendlyName)
		promises.push(window.api.commandImmediate(ip, `FriendlyName ${device.Status.FriendlyName}`));

	Promise.allSettled(promises).then(results => {
		console.log("RES", results);

		oldDevices[device.StatusNET.IPAddress] = {...device};
		setDevices(oldDevices);
		setIsSaving(false);
		new Notification(`Info`, {body : `Device information has been saved!`});
	});
};

export default SaveTasmota;
