/**
 * Decorator that wraps async controller methods to handle errors
 * @description Catches any errors thrown in async controller methods and passes them to Express's error handling middleware
 * @example
 * @catchAsyncErrors()
 * async someControllerMethod() {}
 */
export const catchAsyncErrors = () => {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		const originalMethod = descriptor.value;

		descriptor.value = function (...args: any[]) {
			return Promise.resolve(originalMethod.apply(this, args)).catch(
				args[args.length - 1],
			);
		};

		return descriptor;
	};
};
