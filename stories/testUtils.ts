// Expand jest expect to match style with floating point
import { expect } from "@storybook/test";

declare global {
	namespace jest {
		interface Matchers<R> {
			toHaveStyleWithTolerance(
				expected: Record<string, string | number>,
				tolerance?: number,
			): R;
		}
	}
}

expect.extend({
	toHaveStyleWithTolerance(
		received: HTMLElement,
		expected: Record<string, string | number>,
		tolerance: number = 0.01,
	) {
		const receivedStyles = window.getComputedStyle(received);
		const expectedEntries = Object.entries(expected);

		for (const [property, value] of expectedEntries) {
			const receivedValue = receivedStyles.getPropertyValue(property);
			const expectedValue = value.toString();

			if (typeof value === "number") {
				const receivedNumber = parseFloat(receivedValue);
				const expectedNumber = parseFloat(expectedValue);

				if (Math.abs(receivedNumber - expectedNumber) > tolerance) {
					return {
						message: () =>
							`Expected element to have style ${property}: ${expectedValue}, but received ${receivedValue}`,
						pass: false,
					};
				}
			} else if (receivedValue !== expectedValue) {
				return {
					message: () =>
						`Expected element to have style ${property}: ${expectedValue}, but received ${receivedValue}`,
					pass: false,
				};
			}
		}

		return {
			message: () =>
				`Expected element not to have style ${JSON.stringify(expected)}`,
			pass: true,
		};
	},
});
