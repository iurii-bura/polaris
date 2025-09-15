export type Repository = {
    url: string;
    description: string;
    monthlyCommits: {
        period: string;
        data: {
            month: string;
            commits: number;
        }[];
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

    annualCost?: {
        amount: number;
        currency: string; // USD, EUR, etc.
    };
};

export type LayoutInfo = {
    x: number;
    y: number;
    width?: number;
    height?: number;
    nodeType: string;
    backgroundColor?: string;
};

export type Layouts = Partial<Record<string, LayoutInfo>>;

export type Facts = {
    businessCapabilities: string[];
    cmdbFacts: CmdbFacts;
    git?: GitInfo;
    techStack?: TechStackItem[];
    documents?: Document[];
    links: Link[];
    apiSpecifications?: ApiSpecification[];
    qualityMetrics?: QualityMetrics;
    platforms?: Platform[];
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

export type Group = {
    id: string;
    label: string;
    description: string;
    componentIds: string[];
    layouts: Layouts;
};

export type ComponentGraph = {
    components: ComponentData[];
    groups: Group[];
};

// Graph node update types
export type GraphNode = ComponentData | Group;

export type ComponentLayoutUpdate = {
    node: ComponentData;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
};

export type GroupLayoutUpdate = {
    node: Group;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
};
