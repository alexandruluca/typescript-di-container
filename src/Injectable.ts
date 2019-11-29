export const Types = {};
const injectableMetadataKey = Symbol("design:injectables");

export function Injectable() {
	return function (target) {
		Types[target.name] = () => {
			let injectables = Reflect.getMetadata(injectableMetadataKey, target);
			injectables = injectables && injectables.constructor;
			let paramTypes = Reflect.getMetadata('design:paramtypes', target);

			if(injectables) {
				paramTypes.forEach((param, idx) => {
					if(!param && injectables[idx]) {
						paramTypes[idx] = injectables[idx];
					}
				});
			}

			return paramTypes || [];
		};
	}
}

export const forwardRef = (fn: () => any): ForwardReference => ({
	forwardRef: fn,
});

export interface ForwardReference<T = any> {
	forwardRef: T;
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