import type { FunctionComponent, ReactElement } from 'react';

type LayoutSelectorProps = {
    readonly currentLayout: string;
    readonly availableLayouts: string[];
    readonly onLayoutChange: (layout: string) => void;
};

const nameMap: Record<string, string> = {};

const getLayoutDisplayName = (layout: string): string => {
    // Check if there's a custom mapping for this layout
    if (layout in nameMap) {
        return nameMap[layout];
    }
    // Fall back to default naming logic
    return layout.charAt(0).toUpperCase() + layout.slice(1);
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
                        type="button"
                        key={layout}
                        className={`btn btn-sm ${currentLayout === layout ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => {
                            onLayoutChange(layout);
                        }}
                    >
                        {getLayoutDisplayName(layout)}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LayoutSelector;
