import 'reflect-metadata';
import {Types} from "./Injectable";

export class Container {
	get<T>(Clazz: new (...params) => T): T {
		Clazz = this.getForwardedRef(Clazz);
		let args = this.getArgumentList(Clazz);

		return new Clazz(...args);
	}

	private getArgumentList<T>(Clazz: new (...params) => T) {
		Clazz = this.getForwardedRef(Clazz);
		let types = Types[Clazz.name];

		if(!types) {
			throw new Error(`provider not found for ${Clazz.name}`);
		}

		return types().map(Type => this.get(Type));
	}

	private getForwardedRef<T>(Clazz: new (...params) => T) {
		return Clazz['forwardRef'] ? Clazz['forwardRef']() : Clazz;
	}
}