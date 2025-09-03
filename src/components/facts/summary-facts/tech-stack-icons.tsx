import type { FunctionComponent, ReactElement } from 'react';
import type { TechStackItem } from '../../types';
import {
    SiNodedotjs,
    SiReact,
    SiOpenjdk,
    SiSpring,
    SiPython,
    SiDjango,
    SiPostgresql,
    SiRedis,
    SiKubernetes,
    SiMongodb,
    SiGo
} from 'react-icons/si';
import { FiDatabase, FiServer, FiCode } from 'react-icons/fi';

type TechStackIconsProps = {
    readonly techStack: TechStackItem[];
};

const getTechIcon = (name: string): ReactElement => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('node'))
        return (
            <SiNodedotjs
                className="w-6 h-6 text-green-600"
                title={name}
            />
        );
    if (lowerName.includes('react'))
        return (
            <SiReact
                className="w-6 h-6 text-blue-500"
                title={name}
            />
        );
    if (lowerName.includes('java'))
        return (
            <SiOpenjdk
                className="w-6 h-6 text-red-600"
                title={name}
            />
        );
    if (lowerName.includes('spring'))
        return (
            <SiSpring
                className="w-6 h-6 text-green-500"
                title={name}
            />
        );
    if (lowerName.includes('python'))
        return (
            <SiPython
                className="w-6 h-6 text-blue-600"
                title={name}
            />
        );
    if (lowerName.includes('django'))
        return (
            <SiDjango
                className="w-6 h-6 text-green-700"
                title={name}
            />
        );
    if (lowerName.includes('postgresql'))
        return (
            <SiPostgresql
                className="w-6 h-6 text-blue-700"
                title={name}
            />
        );
    if (lowerName.includes('redis'))
        return (
            <SiRedis
                className="w-6 h-6 text-red-500"
                title={name}
            />
        );
    if (lowerName.includes('kubernetes'))
        return (
            <SiKubernetes
                className="w-6 h-6 text-blue-600"
                title={name}
            />
        );
    if (lowerName.includes('mongodb'))
        return (
            <SiMongodb
                className="w-6 h-6 text-green-600"
                title={name}
            />
        );
    if (lowerName.includes('go'))
        return (
            <SiGo
                className="w-6 h-6 text-cyan-500"
                title={name}
            />
        );
    if (lowerName.includes('cobol'))
        return (
            <FiCode
                className="w-6 h-6 text-blue-800"
                title={name}
            />
        );
    if (lowerName.includes('db2'))
        return (
            <FiDatabase
                className="w-6 h-6 text-blue-600"
                title={name}
            />
        );
    if (lowerName.includes('cics'))
        return (
            <FiServer
                className="w-6 h-6 text-purple-600"
                title={name}
            />
        );
    if (lowerName.includes('express'))
        return (
            <FiCode
                className="w-6 h-6 text-gray-600"
                title={name}
            />
        );

    return (
        <FiCode
            className="w-6 h-6 text-gray-500"
            title={name}
        />
    );
};

const TechStackIcons: FunctionComponent<TechStackIconsProps> = ({ techStack }): ReactElement => {
    return (
        <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
                <div
                    key={tech.name}
                    className="tooltip"
                    data-tip={`${tech.name} ${tech.version}`}
                >
                    {getTechIcon(tech.name)}
                </div>
            ))}
        </div>
    );
};

export default TechStackIcons;
