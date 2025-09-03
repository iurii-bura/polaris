export type TechnologyStatus = 'normal' | 'phased-out' | 'deprecated' | 'unknown';

export type TechnologyWhitelistEntry = {
  name: string;
  status: TechnologyStatus;
  supportedVersions: string[];
  deprecatedVersions?: string[];
  recommendedVersion?: string;
  comment?: string;
};

// Mock whitelist data for testing
export const TECHNOLOGY_WHITELIST: TechnologyWhitelistEntry[] = [
  {
    name: 'Node.js',
    status: 'normal',
    supportedVersions: ['18.x', '20.x', '21.x'],
    deprecatedVersions: ['14.x', '16.x'],
    recommendedVersion: '20.x',
    comment: 'Use LTS versions when possible'
  },
  {
    name: 'React',
    status: 'normal',
    supportedVersions: ['18.x', '19.x'],
    deprecatedVersions: ['16.x', '17.x'],
    recommendedVersion: '18.x',
    comment: 'Migrate from class components to hooks'
  },
  {
    name: 'Express',
    status: 'normal',
    supportedVersions: ['4.x'],
    deprecatedVersions: ['3.x'],
    recommendedVersion: '4.x'
  },
  {
    name: 'Angular',
    status: 'normal',
    supportedVersions: ['15.x', '16.x', '17.x'],
    deprecatedVersions: ['12.x', '13.x', '14.x'],
    recommendedVersion: '17.x'
  },
  {
    name: 'Vue',
    status: 'normal',
    supportedVersions: ['3.x'],
    deprecatedVersions: ['2.x'],
    recommendedVersion: '3.x'
  },
  {
    name: 'Java',
    status: 'normal',
    supportedVersions: ['17', '21'],
    deprecatedVersions: ['8', '11'],
    recommendedVersion: '21'
  },
  {
    name: 'Spring Boot',
    status: 'normal',
    supportedVersions: ['3.x'],
    deprecatedVersions: ['2.x'],
    recommendedVersion: '3.x'
  },
  {
    name: 'Python',
    status: 'normal',
    supportedVersions: ['3.10', '3.11', '3.12'],
    deprecatedVersions: ['3.8', '3.9'],
    recommendedVersion: '3.12'
  },
  {
    name: 'PostgreSQL',
    status: 'normal',
    supportedVersions: ['14.x', '15.x', '16.x'],
    deprecatedVersions: ['12.x', '13.x'],
    recommendedVersion: '15.x'
  },
  {
    name: 'MongoDB',
    status: 'normal',
    supportedVersions: ['6.x', '7.x'],
    deprecatedVersions: ['4.x', '5.x'],
    recommendedVersion: '7.x'
  },
  {
    name: 'Redis',
    status: 'normal',
    supportedVersions: ['7.x'],
    deprecatedVersions: ['6.x'],
    recommendedVersion: '7.x'
  },
  {
    name: 'Django',
    status: 'normal',
    supportedVersions: ['4.x', '5.x'],
    deprecatedVersions: ['3.x'],
    recommendedVersion: '5.x'
  },
  {
    name: 'FastAPI',
    status: 'normal',
    supportedVersions: ['0.104.x', '0.105.x'],
    deprecatedVersions: ['0.95.x', '0.100.x'],
    recommendedVersion: '0.104.x'
  },
  {
    name: 'TensorFlow',
    status: 'normal',
    supportedVersions: ['2.15.x', '2.16.x'],
    deprecatedVersions: ['2.12.x', '2.13.x', '2.14.x'],
    recommendedVersion: '2.15.x'
  },
  {
    name: 'React Native',
    status: 'normal',
    supportedVersions: ['0.72.x', '0.73.x'],
    deprecatedVersions: ['0.68.x', '0.69.x', '0.70.x', '0.71.x'],
    recommendedVersion: '0.72.x'
  },
  {
    name: 'Expo',
    status: 'normal',
    supportedVersions: ['49.x', '50.x'],
    deprecatedVersions: ['47.x', '48.x'],
    recommendedVersion: '49.x'
  },
  {
    name: 'TypeScript',
    status: 'normal',
    supportedVersions: ['5.0.x', '5.1.x', '5.2.x'],
    deprecatedVersions: ['4.8.x', '4.9.x'],
    recommendedVersion: '5.1.x'
  },
  {
    name: 'Redux Toolkit',
    status: 'normal',
    supportedVersions: ['1.9.x', '2.0.x'],
    deprecatedVersions: ['1.8.x'],
    recommendedVersion: '1.9.x'
  },
  {
    name: 'Swift',
    status: 'normal',
    supportedVersions: ['5.9', '5.10'],
    deprecatedVersions: ['5.7', '5.8'],
    recommendedVersion: '5.9'
  },
  {
    name: 'Kotlin',
    status: 'normal',
    supportedVersions: ['1.8.x', '1.9.x'],
    deprecatedVersions: ['1.6.x', '1.7.x'],
    recommendedVersion: '1.9.x'
  },
  {
    name: 'Apache Kafka',
    status: 'normal',
    supportedVersions: ['3.5.x', '3.6.x'],
    deprecatedVersions: ['3.3.x', '3.4.x'],
    recommendedVersion: '3.5.x'
  },
  {
    name: 'jQuery',
    status: 'phased-out',
    supportedVersions: ['3.x'],
    deprecatedVersions: ['1.x', '2.x'],
    recommendedVersion: '3.x',
    comment: 'Consider migrating to modern frameworks'
  },
  {
    name: 'Ionic',
    status: 'phased-out',
    supportedVersions: ['7.x'],
    deprecatedVersions: ['6.x'],
    recommendedVersion: '7.x',
    comment: 'Consider React Native or Flutter for better performance'
  },
  {
    name: 'Apache Struts',
    status: 'phased-out',
    supportedVersions: ['2.5.x'],
    deprecatedVersions: ['2.3.x', '2.4.x'],
    recommendedVersion: '2.5.x',
    comment: 'Migrate to Spring Boot for better security and maintenance'
  },
  {
    name: 'AngularJS',
    status: 'deprecated',
    supportedVersions: [],
    deprecatedVersions: ['1.x'],
    comment: 'End of life - migrate to Angular 2+'
  },
  {
    name: 'CoffeeScript',
    status: 'deprecated',
    supportedVersions: [],
    deprecatedVersions: ['1.x', '2.x'],
    comment: 'Use TypeScript instead'
  },
  {
    name: 'Bower',
    status: 'deprecated',
    supportedVersions: [],
    deprecatedVersions: ['1.x'],
    comment: 'Use npm or yarn instead'
  }
];

export function getTechnologyStatus(name: string, version: string): TechnologyStatus {
  const entry = TECHNOLOGY_WHITELIST.find(
    (tech) => tech.name.toLowerCase() === name.toLowerCase()
  );

  if (!entry) {
    return 'unknown';
  }

  // Check if version is in deprecated list
  if (entry.deprecatedVersions?.some(depVersion => 
    version.toLowerCase().includes(depVersion.toLowerCase())
  )) {
    return entry.status === 'deprecated' ? 'deprecated' : 'phased-out';
  }

  // Check if version is in supported list
  if (entry.supportedVersions.some(suppVersion => 
    version.toLowerCase().includes(suppVersion.toLowerCase())
  )) {
    return entry.status;
  }

  // If not found in either list, return the technology's overall status
  return entry.status;
}

export function getTechnologyEntry(name: string): TechnologyWhitelistEntry | undefined {
  return TECHNOLOGY_WHITELIST.find(
    (tech) => tech.name.toLowerCase() === name.toLowerCase()
  );
}
