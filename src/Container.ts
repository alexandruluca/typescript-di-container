import 'reflect-metadata';
import {Types, ForwardRef} from "./Injectable";

export class Container {
	private initial: string;
	private traversalGraph: {[key: string]: boolean | string} = {};
	get<T>(Clazz: new (...params) => T): T {
		this.initial = Clazz.name;

		let instance = this._get(Clazz);
		this.initial = null;
		this.traversalGraph = {};
		return instance;
	}

	private _get<T>(Clazz: new (...params) => T): T {
		let args = this.getArgumentList(Clazz);
		return new Clazz(...args);
	}

	private getArgumentList<T>(Clazz: new (...params) => T) {
		if (Clazz instanceof ForwardRef) {
			Clazz = Clazz.unwrap();
		}
		let types = Types[Clazz.name];

		if(!types) {
			throw new Error(`Provider not found for ${Clazz.name}. Make sure ${Clazz.name} is decorated with @Injectable`);
		}

		return types().map(Type => {
			if(this.traversalGraph[Type.name]) {
				let keys = Object.keys(this.traversalGraph);
				keys.unshift(this.initial);

				throw new Error(`Circular dependency detected: ${keys.join(' -> ')}`);

			}
			this.traversalGraph[Type.name] = true;
			return this._get(Type);
		});
	}
}