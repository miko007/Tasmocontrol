import React, {useState, useEffect, useCallback} from "react";

const Network = ({config, setConfig}) => {
	const [interfaces, setInterfaces] = useState([]);
	const [iface, setIface]           = useState(null);
	const [address, setAddress]       = useState(null);

	useEffect(() => {
		window.network.interfaces();
		window.network.interfaceUpdate(ifaces => {
			console.log("IFACE", ifaces)
			setInterfaces(ifaces)
		});
	}, []);

	const selectIface = useCallback(event => {
		setIface(interfaces[event.target.value]);
		setAddress(null);
	}, [interfaces]);

	return (
		<>
			<h5>Network</h5>
			<p className="form-group">
				<label>Network interface</label>
				<select className="form-control" value={iface?.name} onChange={selectIface}>
					<option value="" disabled>Select network interface...</option>
					{Object.values(interfaces).map(iface => <option key={iface.name} value={iface.name}>{iface.name}</option>)}
				</select>
			</p>
			<p className="form-group">
				<label>Network address</label>
				<select className="form-control" value={address || ""} onChange={event => setAddress(event.target.value)}>
					<option value="" disabled>Select network address...</option>
					{iface?.addresses.map(address => <option key={address.address} value={address.address}>{address.address}</option>)}
				</select>
			</p>
			</>
	);
};

export default Network;
