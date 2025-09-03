import type { FunctionComponent, ReactElement } from 'react';
import { useState, useCallback } from 'react';
import { 
  FiDatabase, 
  FiChevronDown, 
  FiChevronUp, 
  FiUsers, 
  FiDollarSign,
  FiShield,
  FiSettings,
  FiTag,
  FiLink,
  FiUser,
  FiMail,
  FiHome,
  FiLayers,
  FiCloud,
  FiServer,
  FiActivity,
  FiBox
} from 'react-icons/fi';
import type { CmdbFacts as CmdbFactsType } from '../../types';

type CmdbFactsProps = {
  readonly cmdbFacts: CmdbFactsType;
};

const CmdbFacts: FunctionComponent<CmdbFactsProps> = ({ cmdbFacts }): ReactElement => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Get status color and icon
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { className: 'badge-success', icon: FiActivity };
      case 'under-development':
        return { className: 'badge-warning', icon: FiSettings };
      case 'decommissioned':
        return { className: 'badge-error', icon: FiBox };
      case 'retired':
        return { className: 'badge-neutral', icon: FiBox };
      default:
        return { className: 'badge-neutral', icon: FiActivity };
    }
  };

  // Get application type icon
  const getAppTypeIcon = (type: string) => {
    switch (type) {
      case 'web-application':
        return FiDatabase;
      case 'mobile-app':
        return FiActivity;
      case 'api-service':
        return FiServer;
      case 'database':
        return FiDatabase;
      case 'middleware':
        return FiLayers;
      default:
        return FiBox;
    }
  };

  // Get deployment model icon
  const getDeploymentIcon = (model: string) => {
    switch (model) {
      case 'cloud':
        return FiCloud;
      case 'on-premises':
        return FiServer;
      case 'hybrid':
        return FiLayers;
      default:
        return FiServer;
    }
  };

  // Get data classification color
  const getDataClassColor = (classification: string) => {
    switch (classification) {
      case 'public':
        return 'badge-info';
      case 'internal':
        return 'badge-primary';
      case 'confidential':
        return 'badge-warning';
      case 'restricted':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const statusConfig = getStatusConfig(cmdbFacts.status);
  const StatusIcon = statusConfig.icon;
  const AppTypeIcon = getAppTypeIcon(cmdbFacts.applicationType);
  const DeploymentIcon = getDeploymentIcon(cmdbFacts.deploymentModel);

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-6">
        {/* Header - Always Visible */}
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-base-200/50 rounded-lg p-2 -m-2 transition-colors"
          onClick={toggleExpanded}
        >
          <div className="flex items-center gap-3">
            <FiDatabase className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">CMDB Facts</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status Badge */}
            <div className={`badge ${statusConfig.className} badge-sm`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {cmdbFacts.status}
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

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 space-y-6">
            {/* Basic Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FiTag className="w-4 h-4 text-primary" />
                <span className="font-medium">Basic Information</span>
              </div>
              <div className="pl-6 space-y-2 text-sm">
                <div><span className="font-medium">ID:</span> <span className="font-mono text-primary">{cmdbFacts.id}</span></div>
                <div><span className="font-medium">Name:</span> {cmdbFacts.name}</div>
                <div><span className="font-medium">Description:</span> {cmdbFacts.description}</div>
                <div>
                  <span className="font-medium">Solution:</span> 
                  <a 
                    href={cmdbFacts.solution.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-primary hover:text-primary-focus hover:underline"
                  >
                    {cmdbFacts.solution.name} ({cmdbFacts.solution.id})
                    <FiLink className="w-3 h-3 inline ml-1" />
                  </a>
                </div>
                {cmdbFacts.aliases && cmdbFacts.aliases.length > 0 && (
                  <div>
                    <span className="font-medium">Aliases:</span> 
                    <div className="flex flex-wrap gap-1 mt-1">
                      {cmdbFacts.aliases.map((alias, index) => (
                        <span key={index} className="badge badge-outline badge-sm">{alias}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Subcomponents */}
            {cmdbFacts.subcomponents && cmdbFacts.subcomponents.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiBox className="w-4 h-4 text-primary" />
                  <span className="font-medium">Subcomponents ({cmdbFacts.subcomponents.length})</span>
                </div>
                <div className="pl-6 grid gap-2">
                  {cmdbFacts.subcomponents.map((subcomp, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-base-200/50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="badge badge-outline badge-sm font-mono">{subcomp.id}</span>
                        <span className="text-sm">{subcomp.description}</span>
                      </div>
                      <a 
                        href={subcomp.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-xs"
                      >
                        <FiLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Classification */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AppTypeIcon className="w-4 h-4 text-primary" />
                <span className="font-medium">Technical Classification</span>
              </div>
              <div className="pl-6 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Type:</span>
                  <span className="badge badge-primary badge-sm">{cmdbFacts.applicationType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Category:</span>
                  <span className="badge badge-secondary badge-sm">{cmdbFacts.applicationCategory}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Data Classification:</span>
                  <span className={`badge ${getDataClassColor(cmdbFacts.dataClassification)} badge-sm`}>
                    <FiShield className="w-3 h-3 mr-1" />
                    {cmdbFacts.dataClassification}
                  </span>
                </div>
                {cmdbFacts.architecturePattern && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Architecture:</span>
                    <span className="badge badge-outline badge-sm">{cmdbFacts.architecturePattern}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-medium">Deployment:</span>
                  <span className="badge badge-accent badge-sm">
                    <DeploymentIcon className="w-3 h-3 mr-1" />
                    {cmdbFacts.deploymentModel}
                  </span>
                </div>
              </div>
            </div>

            {/* Ownership */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-primary" />
                <span className="font-medium">Ownership</span>
              </div>
              <div className="pl-6 space-y-3 text-sm">
                {cmdbFacts.owner.businessOwner && (
                  <div className="p-3 bg-base-200/30 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <FiUser className="w-4 h-4 text-success" />
                      <span className="font-medium text-success">Business Owner</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <FiUser className="w-3 h-3" />
                        {cmdbFacts.owner.businessOwner.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMail className="w-3 h-3" />
                        <a href={`mailto:${cmdbFacts.owner.businessOwner.email}`} className="text-primary hover:underline">
                          {cmdbFacts.owner.businessOwner.email}
                        </a>
                      </div>
                      {cmdbFacts.owner.businessOwner.department && (
                        <div className="flex items-center gap-2">
                          <FiHome className="w-3 h-3" />
                          {cmdbFacts.owner.businessOwner.department}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {cmdbFacts.owner.technicalOwner && (
                  <div className="p-3 bg-base-200/30 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <FiSettings className="w-4 h-4 text-info" />
                      <span className="font-medium text-info">Technical Owner</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <FiUser className="w-3 h-3" />
                        {cmdbFacts.owner.technicalOwner.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMail className="w-3 h-3" />
                        <a href={`mailto:${cmdbFacts.owner.technicalOwner.email}`} className="text-primary hover:underline">
                          {cmdbFacts.owner.technicalOwner.email}
                        </a>
                      </div>
                      {cmdbFacts.owner.technicalOwner.team && (
                        <div className="flex items-center gap-2">
                          <FiUsers className="w-3 h-3" />
                          {cmdbFacts.owner.technicalOwner.team}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Information */}
            {(cmdbFacts.costCenter || cmdbFacts.annualCost) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4 text-primary" />
                  <span className="font-medium">Financial Information</span>
                </div>
                <div className="pl-6 space-y-2 text-sm">
                  {cmdbFacts.costCenter && (
                    <div><span className="font-medium">Cost Center:</span> <span className="font-mono">{cmdbFacts.costCenter}</span></div>
                  )}
                  {cmdbFacts.annualCost && (
                    <div>
                      <span className="font-medium">Annual Cost:</span> 
                      <span className="ml-2 badge badge-warning">
                        {cmdbFacts.annualCost.amount.toLocaleString()} {cmdbFacts.annualCost.currency}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vendor & Licensing */}
            {(cmdbFacts.vendor || cmdbFacts.licenseModel) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiTag className="w-4 h-4 text-primary" />
                  <span className="font-medium">Vendor & Licensing</span>
                </div>
                <div className="pl-6 space-y-2 text-sm">
                  {cmdbFacts.vendor && (
                    <div className="space-y-1">
                      <div><span className="font-medium">Vendor:</span> {cmdbFacts.vendor.name}</div>
                      {cmdbFacts.vendor.supportContact && (
                        <div>
                          <span className="font-medium">Support:</span> 
                          <a href={`mailto:${cmdbFacts.vendor.supportContact}`} className="ml-2 text-primary hover:underline">
                            {cmdbFacts.vendor.supportContact}
                          </a>
                        </div>
                      )}
                      {cmdbFacts.vendor.contractEndDate && (
                        <div><span className="font-medium">Contract End:</span> {cmdbFacts.vendor.contractEndDate}</div>
                      )}
                    </div>
                  )}
                  {cmdbFacts.licenseModel && (
                    <div>
                      <span className="font-medium">License Model:</span> 
                      <span className="ml-2 badge badge-outline">{cmdbFacts.licenseModel}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CmdbFacts;
