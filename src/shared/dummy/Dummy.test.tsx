import { describe, test, expect } from '@rstest/core';
import { render } from '@testing-library/react';

import { Dummy } from './Dummy';

describe('<Dummy />', () => {
    test('should render with upperCase', () => {
        // Given
        const upperCase = true;

        // When
        const { asFragment } = render(
            <Dummy
                name="Name"
                upperCase={upperCase}
            />
        );

        // Then
        expect(asFragment()).toMatchSnapshot();
    });

    test('should render without upperCase', () => {
        // Given
        const upperCase = false;

        // When
        const { asFragment } = render(
            <Dummy
                name="Name"
                upperCase={upperCase}
            />
        );

        // Then
        expect(asFragment()).toMatchSnapshot();
    });
});
