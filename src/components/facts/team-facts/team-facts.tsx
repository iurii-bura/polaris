import type { FunctionComponent, ReactElement } from 'react';
import { useState, useCallback } from 'react';
import { FiUsers, FiUser, FiXCircle, FiChevronDown, FiChevronUp, FiAlertTriangle } from 'react-icons/fi';
import type { Team } from '../../types';

type TeamFactsProps = {
  readonly team?: Team;
};

const TeamFacts: FunctionComponent<TeamFactsProps> = ({ team }): ReactElement => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Team status for header display
  const getTeamStatus = () => {
    if (!team) {
      return {
        text: 'Unknown',
        icon: FiXCircle,
        className: 'text-error',
        showIcon: true
      };
    }
    
    // Check if solution architect is missing
    if (!team.solutionArchitect) {
      return {
        text: team.teamName,
        icon: FiAlertTriangle,
        className: 'text-warning',
        showIcon: true
      };
    }
    
    return {
      text: team.teamName,
      icon: FiUsers,
      className: 'text-base-content',
      showIcon: false
    };
  };

  const teamStatus = getTeamStatus();

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-6">
        {/* Header - Always Visible */}
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-base-200/50 rounded-lg p-2 -m-2 transition-colors"
          onClick={toggleExpanded}
        >
          <div className="flex items-center gap-3">
            <FiUsers className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Team</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Team Status - Always Visible */}
            <div className="flex items-center gap-2">
              {teamStatus.showIcon && (
                <teamStatus.icon className={`w-4 h-4 ${teamStatus.className}`} />
              )}
              <span className={`text-sm font-medium ${teamStatus.className}`}>
                {teamStatus.text}
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

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
            {!team ? (
              <div className="text-center py-8 text-base-content/60">
                <FiUsers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Team Information</h3>
                <p className="text-sm">Team details are not available for this component.</p>
              </div>
            ) : (
              <>
                {/* Team Name */}
                <div className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FiUsers className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-base-content">
                        <a 
                          href={team.kbSpaceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          {team.teamName}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Solution Architect */}
                <div className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {team.solutionArchitect ? (
                      <>
                        <img
                          src={team.solutionArchitect.avatarUrl}
                          alt={`${team.solutionArchitect.name} avatar`}
                          className="w-8 h-8 rounded-full bg-base-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center text-xs font-medium hidden">
                          <FiUser className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-base-content">SA: {team.solutionArchitect.name}</div>
                          <div className="text-xs text-base-content/60">{team.solutionArchitect.email}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center">
                          <FiAlertTriangle className="w-4 h-4 text-warning" />
                        </div>
                        <div>
                          <div className="font-medium text-warning">Not Assigned</div>
                          <div className="text-xs text-base-content/60">Solution Architect not assigned</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamFacts;
