import React from 'react';
import { render } from '@testing-library/react';
import { store } from 'reducers';
import { Provider } from 'react-redux';
import App from '.';

describe('When rendering App', () => {
  it('should render', () => {
    const { getAllByRole } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(getAllByRole('generic')).toBeTruthy();
  });
});
