export type Repository = {
  url: string;
  description: string;
  monthlyCommits: {
    period: string;
    data: Array<{
      month: string;
      commits: number;
    }>;
  };
};

export type Contributor = {
  name: string;
  email: string;
  avatarUrl: string;
};

export type GitInfo = {
  repositories: Repository[];
  lastCommit: string;
  topContributors: Contributor[];
};

export type TechStackItem = {
  name: string;
  version: string;
  source: string;
};

export type CmdbInfo = {
  id: string;
  name: string;
  description: string;
  type: string;
};

export type Document = {
  url: string;
  description: string;
};

export type Link = {
  type: string;
  url: string;
};

export type ApiSpecification = {
  apiType: 'REST' | 'GraphQL' | 'SOAP' | 'other';
  apiSpace: string;
  specification?: string;
};

export type QualityMetrics = {
  codeCoveragePercentage: number;
  linkToCoverageReport: string;
  apiLintingIssues: {
    minor: number;
    major: number;
  };
};

export type Platform = {
  type: 'mainframe' | 'onprem' | 'azure';
  comment: string;
};

export type SolutionArchitect = {
  name: string;
  email: string;
  avatarUrl: string;
};

export type Team = {
  teamName: string;
  kbSpaceLink: string;
  solutionArchitect?: SolutionArchitect;
};

export type KafkaInfo = {
  publishingToTopics: string[];
  listeningToTopics: string[];
};

export type CmdbFacts = {
  // Basic Identification
  id: string;
  name: string;
  description: string;
  aliases?: string[]; // Alternative names/codes
  
  // Solution Hierarchy
  solution: {
    id: string;
    name: string;
    link: string; // Link to solution CMDB entry
  };
  
  // Subcomponents
  subcomponents?: {
    id: string; // Pattern: [TWO LETTERS]-[TWO DIGITS] (e.g., "DB-01", "AP-02")
    description: string;
    link: string; // Link to subcomponent CMDB entry
  }[];
  
  // Classification
  applicationType: 'web-application' | 'desktop-application' | 'mobile-app' | 
                   'api-service' | 'batch-job' | 'database' | 'middleware' | 'other';
  applicationCategory: 'core-business' | 'supporting' | 'infrastructure' | 
                      'integration' | 'analytics' | 'security' | 'other';
  
  // Business Context
  businessCapabilities: string[]; // Inherited from existing structure
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
  
  // Technical Details
  architecturePattern?: 'monolith' | 'microservices' | 'soa' | 'serverless' | 
                       'event-driven' | 'layered' | 'other';
  deploymentModel: 'on-premises' | 'cloud' | 'hybrid' | 'multi-cloud';
  
  // Lifecycle & Status
  status: 'active' | 'under-development' | 'decommissioned' | 'retired';

  // Financial & Governance
  owner: {
    businessOwner?: {
      name: string;
      email: string;
      department?: string;
    };
    technicalOwner?: {
      name: string;
      email: string;
      team?: string;
    };
  };
  
  costCenter?: string;
  annualCost?: {
    amount: number;
    currency: string; // USD, EUR, etc.
  };
  
  // Vendor & Licensing
  vendor?: {
    name: string;
    supportContact?: string;
    contractEndDate?: string;
  };
  licenseModel?: 'open-source' | 'commercial' | 'saas' | 'subscription' | 'perpetual';
};

export type LayoutInfo = {
  x: number;
  y: number;
  nodeType: string;
};

export type Layouts = Record<string, LayoutInfo>;

export type Facts = {
  businessCapabilities: string[];
  cmdb: CmdbInfo;
  cmdbFacts: CmdbFacts;
  git: GitInfo;
  techStack: TechStackItem[];
  documents?: Document[];
  links: Link[];
  apiSpecifications?: ApiSpecification[];
  qualityMetrics: QualityMetrics;
  platforms: Platform[];
  team?: Team;
  kafka?: KafkaInfo;
};

export type ComponentData = {
  id: string;
  label: string;
  description: string;
  facts: Facts;
  layouts: Layouts;
};
