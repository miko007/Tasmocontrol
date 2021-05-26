class Std {
	static ObjResolve(object, path) {
		if (path.length === 1)
			return object[path[0]];
		else if (path.length === 0)
			throw new Error();
		else {
			if (object[path[0]])
				return Std.ObjResolve(object[path[0]], path.slice(1));
			else {
				object[path[0]] = {};

				return Std.ObjResolve(object[path[0]], path.slice(1));
			}
		}
	}

	static ObjSet(object, memberPath, value) {
		const [head, ...rest] = memberPath.toString().split(".");

		!rest.length ? object[head] = value : Std.ObjSet(object[head], value, rest.join("."));
	}

}

export default Std;
