import type { FunctionComponent, ReactElement } from 'react';

type DummyProps = {
    readonly name: string;
    readonly upperCase?: boolean;
};

const Dummy: FunctionComponent<DummyProps> = ({ name, upperCase }): ReactElement => {
    return <h1>Hello, {upperCase === true ? name.toUpperCase() : name}!</h1>;
};

export { Dummy };
