export const Types = {};
const injectableMetadataKey = Symbol("design:injectables");

export function Injectable() {
	return function (target) {
		Types[target.name] = () => {
			let injectables = Reflect.getMetadata(injectableMetadataKey, target) || [];
			injectables = injectables && injectables.constructor;
			let paramTypes = Reflect.getMetadata('design:paramtypes', target);

			paramTypes.forEach((param, idx) => {
				if (!param && injectables[idx]) {
					paramTypes[idx] = injectables[idx];
				}

				if (!paramTypes[idx]) {
					let message = `@Injectable called with undefined at index ${idx} this could mean that ` +
						`the class ${target.name} has a circular dependency problem. Use ForwardRef to overcome this problem`;
					throw new Error(message);
				}

				if(paramTypes[idx] instanceof ForwardRef) {
					paramTypes[idx] = paramTypes[idx].unwrap();
				}
			});

			return paramTypes || [];
		};
	}
}

export function Inject(injectable) {
	return function (target: Object, propertyKey: string, parameterIndex: number) {
		let existingForwardRefs: {[key: string]: any} = Reflect.getOwnMetadata(injectableMetadataKey, target, propertyKey) || {};
		let methodName = propertyKey || 'constructor';

		existingForwardRefs[methodName] = existingForwardRefs[methodName] || []
		existingForwardRefs[methodName][parameterIndex] = injectable;

		Reflect.defineMetadata(injectableMetadataKey, existingForwardRefs, target, propertyKey);
	}
}

export class ForwardRef<T> {
	private cb: () => T;
	public constructor(cb: () => T) {
		this.cb = cb;
	}

	public unwrap() {
		return this.cb();
	}
}