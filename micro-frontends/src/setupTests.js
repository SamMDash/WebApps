// mock the fetch global using jest
require("jest-fetch-mock").enableMocks();
jest.mock("./next-ui/Components/i18n/utils");

jest.mock('@testing-library/react', () => {
  const React = require('react');
  const rtl = jest.requireActual('@testing-library/react');
  const { IntlProvider } = require('react-intl');
  
  const customRender = (ui, options) => {
    const Wrapper = ({ children }) => React.createElement(IntlProvider, { locale: 'en' }, children);
    return rtl.render(ui, { wrapper: Wrapper, ...options });
  };

  return {
    ...rtl,
    render: customRender
  };
});

// Polyfill ResizeObserver for jsdom/test environment
if (typeof window !== "undefined" && !window.ResizeObserver) {
	window.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
}