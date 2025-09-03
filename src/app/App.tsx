import type { FunctionComponent, ReactElement } from 'react';

import { Dummy } from '@/shared';

const App: FunctionComponent = (): ReactElement => {
    return (
        <main role="main">
            <h1 className="text-3xl font-bold underline">Hello, world!</h1>

            <Dummy
                name="Dummy"
                upperCase={true}
            />
        </main>
    );
};

export { App };
