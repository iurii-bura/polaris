import type { FunctionComponent, ReactElement } from 'react';

type LayoutSelectorProps = {
  readonly currentLayout: string;
  readonly availableLayouts: string[];
  readonly onLayoutChange: (layout: string) => void;
};

const LayoutSelector: FunctionComponent<LayoutSelectorProps> = ({ 
  currentLayout, 
  availableLayouts, 
  onLayoutChange 
}): ReactElement => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text text-sm font-medium">Layout</span>
      </label>
      <div className="flex gap-2">
        {availableLayouts.map((layout) => (
          <button
            key={layout}
            className={`btn btn-sm ${
              currentLayout === layout ? 'btn-primary' : 'btn-outline'
            }`}
            onClick={() => onLayoutChange(layout)}
          >
            {layout.charAt(0).toUpperCase() + layout.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;
