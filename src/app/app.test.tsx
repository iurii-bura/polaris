import { describe, test, expect } from '@rstest/core';
import { render } from '@testing-library/react';

import { App } from './app';

describe('<App />', () => {
    test('should render', () => {
        // Given

        // When
        const { asFragment } = render(<App />);

        // Then
        expect(asFragment()).toMatchSnapshot();
    });
});
