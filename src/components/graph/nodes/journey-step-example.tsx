import { ReactFlow, Node } from '@xyflow/react';
import { JourneyStepNode } from './journey-step-node';
import type { JourneyStepData } from '../../types';

// Example data for journey steps
const exampleJourneySteps: Node<JourneyStepData>[] = [
    {
        id: 'step-1',
        type: 'journeyStep',
        position: { x: 100, y: 100 },
        data: {
            id: 'login-form',
            label: 'User Login',
            stepNumber: 1,
            description: 'User enters credentials to access the application',
            screenshot: '/screenshots/login-form.png',
            onClick: (stepData: JourneyStepData) => {
                console.log('Clicked on step:', stepData);
                // Handle step click - could open modal, navigate, etc.
            }
        }
    },
    {
        id: 'step-2',
        type: 'journeyStep',
        position: { x: 400, y: 100 },
        data: {
            id: 'dashboard',
            label: 'Dashboard Overview',
            stepNumber: 2,
            description: 'Main dashboard showing user metrics and navigation options',
            screenshot: '/screenshots/dashboard.png',
            onClick: (stepData: JourneyStepData) => {
                console.log('Clicked on step:', stepData);
            }
        }
    },
    {
        id: 'step-3',
        type: 'journeyStep',
        position: { x: 700, y: 100 },
        data: {
            id: 'profile-edit',
            label: 'Edit Profile',
            stepNumber: 3,
            description: 'User can update their personal information and preferences',
            screenshot: '/screenshots/profile-form.png',
            onClick: (stepData: JourneyStepData) => {
                console.log('Clicked on step:', stepData);
            }
        }
    }
];

// Define custom node types
const nodeTypes = {
    journeyStep: JourneyStepNode
};

// Example edges connecting the journey steps
const exampleEdges = [
    {
        id: 'e1-2',
        source: 'step-1',
        target: 'step-2',
        type: 'smoothstep',
        style: { stroke: '#3b82f6', strokeWidth: 2 }
    },
    {
        id: 'e2-3',
        source: 'step-2',
        target: 'step-3',
        type: 'smoothstep',
        style: { stroke: '#3b82f6', strokeWidth: 2 }
    }
];

/**
 * Example usage of JourneyStepNode in a ReactFlow diagram
 * 
 * To use this in your application:
 * 1. Import the JourneyStepNode component
 * 2. Register it in the nodeTypes object
 * 3. Create nodes with type 'journeyStep' and appropriate data
 * 4. Render with ReactFlow component
 */
export const JourneyFlowExample = () => {
    return (
        <div className="w-full h-96 border border-gray-200 rounded-lg">
            <ReactFlow
                nodes={exampleJourneySteps}
                edges={exampleEdges}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
            />
        </div>
    );
};

/**
 * Helper function to create a journey step node
 */
export const createJourneyStepNode = (
    id: string,
    position: { x: number; y: number },
    stepData: Omit<JourneyStepData, 'id'> & { id?: string }
): Node<JourneyStepData> => {
    return {
        id,
        type: 'journeyStep',
        position,
        data: {
            id: stepData.id || id,
            ...stepData
        }
    };
};

export default JourneyFlowExample;