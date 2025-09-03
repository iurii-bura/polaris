import type { FunctionComponent, ReactElement } from 'react';
import type { Link } from '../../types';

type LinksFactsProps = {
  readonly links: Link[];
};

const LinksFacts: FunctionComponent<LinksFactsProps> = ({ links }): ReactElement => {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Links</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(links, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default LinksFacts;
