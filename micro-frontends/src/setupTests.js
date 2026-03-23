// mock the fetch global using jest
require("jest-fetch-mock").enableMocks();
jest.mock("./next-ui/Components/i18n/utils");

// Polyfill ResizeObserver for jsdom/test environment
if (typeof window !== "undefined" && !window.ResizeObserver) {
	window.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
}