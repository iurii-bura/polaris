import type { FunctionComponent, ReactElement } from 'react';
import { useState, useCallback } from 'react';
import { FiSettings, FiX } from 'react-icons/fi';
import LayoutSelector from './layout-selector';

type LayoutControlsProps = {
  readonly currentLayout: string;
  readonly onLayoutChange: (layout: string) => void;
};

const LayoutControls: FunctionComponent<LayoutControlsProps> = ({ 
  currentLayout, 
  onLayoutChange 
}): ReactElement => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const availableLayouts = ['default', 'team'];

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleLayoutChange = useCallback((layout: string) => {
    onLayoutChange(layout);
  }, [onLayoutChange]);

  if (!isExpanded) {
    // Collapsed state - circular menu button
    return (
      <div className="fixed top-4 left-4 z-50">
        <button
          className="btn btn-circle btn-primary shadow-lg"
          onClick={handleToggle}
          title="Open Layout Controls"
        >
          <FiSettings className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Expanded state - controls panel
  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="card bg-base-100 shadow-xl border border-base-300 w-80">
        <div className="card-body p-4">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title text-lg">Graph Controls</h3>
            <button
              className="btn btn-sm btn-ghost btn-circle"
              onClick={handleToggle}
              title="Close Controls"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          {/* Layout Controls */}
          <LayoutSelector
            currentLayout={currentLayout}
            availableLayouts={availableLayouts}
            onLayoutChange={handleLayoutChange}
          />
        </div>
      </div>
    </div>
  );
};

export default LayoutControls;
