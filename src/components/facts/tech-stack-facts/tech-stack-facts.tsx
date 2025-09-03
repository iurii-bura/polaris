import type { FunctionComponent, ReactElement } from 'react';
import { useState, useCallback } from 'react';
import { FiCode, FiAlertTriangle, FiCheckCircle, FiXCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import type { TechStackItem } from '../../types';
import { getTechnologyStatus } from './tech-whitelist';
import TechnologyItem from './technology-item';

type TechStackFactsProps = {
  readonly techStack: TechStackItem[];
};

const TechStackFacts: FunctionComponent<TechStackFactsProps> = ({ techStack }): ReactElement => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Calculate status summary
  const statusSummary = techStack.reduce(
    (acc, item) => {
      const status = getTechnologyStatus(item.name, item.version);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Ensure all status types are represented for consistent UI
  const allStatuses = ['normal', 'phased-out', 'deprecated', 'unknown'];
  const completeStatusSummary = allStatuses.reduce((acc, status) => {
    acc[status] = statusSummary[status] || 0;
    return acc;
  }, {} as Record<string, number>);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'normal':
        return {
          className: 'bg-success/10 text-success border-success/20',
          text: 'Supported',
          icon: FiCheckCircle
        };
      case 'phased-out':
        return {
          className: 'bg-warning/10 text-warning border-warning/20',
          text: 'Phased Out',
          icon: FiAlertTriangle
        };
      case 'deprecated':
        return {
          className: 'bg-error/10 text-error border-error/20',
          text: 'Deprecated',
          icon: FiXCircle
        };
      case 'unknown':
        return {
          className: 'bg-base-300/50 text-base-content/60 border-base-300',
          text: 'Unknown',
          icon: () => <span className="text-base-content/60 font-bold">?</span>
        };
      default:
        return {
          className: 'bg-base-300/50 text-base-content/60 border-base-300',
          text: status,
          icon: () => <span className="text-base-content/60 font-bold">?</span>
        };
    }
  };

  const getStatusIcon = (status: string) => {
    const config = getStatusConfig(status);
    const IconComponent = config.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  const getStatusLabel = (status: string) => {
    return getStatusConfig(status).text;
  };

  const getComplianceStatus = () => {
    const hasIssues = completeStatusSummary.deprecated > 0 || completeStatusSummary['phased-out'] > 0;
    return {
      isCompliant: !hasIssues,
      icon: hasIssues ? FiAlertTriangle : FiCheckCircle,
      text: hasIssues ? 'Action Required' : 'Compliant',
      className: hasIssues ? 'text-warning' : 'text-success'
    };
  };

  const complianceStatus = getComplianceStatus();

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-6">
        {/* Header - Always Visible */}
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-base-200/50 rounded-lg p-2 -m-2 transition-colors"
          onClick={toggleExpanded}
        >
          <div className="flex items-center gap-3">
            <FiCode className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Tech Stack</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Compliance Status - Always Visible */}
            <div className="flex items-center gap-2">
              <complianceStatus.icon className={`w-4 h-4 ${complianceStatus.className}`} />
              <span className={`text-sm font-medium ${complianceStatus.className}`}>
                {complianceStatus.text}
              </span>
            </div>
            
            {/* Expand/Collapse Button */}
            <button className="btn btn-ghost btn-sm btn-circle">
              {isExpanded ? (
                <FiChevronUp className="w-4 h-4" />
              ) : (
                <FiChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Content */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="mt-4">
            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {Object.entries(completeStatusSummary).map(([status, count]) => {
                const config = getStatusConfig(status);
                const IconComponent = config.icon;
                return (
                  <div 
                    key={status} 
                    className={`tooltip tooltip-bottom flex items-center justify-center gap-2 p-3 rounded-lg border ${config.className} relative z-10`}
                    data-tip={config.text}
                  >
                    <IconComponent className="w-4 h-4 flex-shrink-0" />
                    <div className="font-bold text-lg">{count}</div>
                  </div>
                );
              })}
            </div>

            {/* Technology List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-base-content/60">Dependencies</h3>
                <a 
                  href="#" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:text-primary-focus underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Full report
                </a>
              </div>
              {techStack.map((item, index) => (
                <TechnologyItem key={`${item.name}-${index}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStackFacts;
