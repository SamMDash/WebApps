import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import Loader from './Loader';

const messages = {
  LOADING_MESSAGE: 'Loading... Please Wait'
};

describe('Loader Component', () => {
  it('renders loader correctly', () => {
    const { getAllByText } = render(
      <IntlProvider locale="en" messages={messages}>
        <Loader />
      </IntlProvider>
    );

    expect(getAllByText("Loading... Please Wait").length).toEqual(1);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <IntlProvider locale="en" messages={messages}>
        <Loader />
      </IntlProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
