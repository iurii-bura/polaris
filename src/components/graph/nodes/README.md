# Journey Step Node

A custom ReactFlow node component designed to display user journey steps with screenshots and metadata. This component is perfect for visualizing user flows, form steps, or any sequential process in your application.

## Features

- 📸 **Screenshot Display**: Shows screenshots of UI steps with error handling
- 🏷️ **Step Numbering**: Optional numbered badges for sequential steps
- 📝 **Rich Metadata**: Displays step name, description, and ID
- 🖱️ **Interactive**: Click handlers and hover effects
- ♿ **Accessible**: Full accessibility support with ARIA labels
- 📱 **Responsive**: Mobile-first design with TailwindCSS
- 🔌 **ReactFlow Integration**: Built-in handles for connections

## Usage

### Basic Usage

```tsx
import { ReactFlow, Node } from '@xyflow/react';
import { JourneyStepNode } from './components/graph/nodes';
import type { JourneyStepData } from './components/types';

const nodeTypes = {
    journeyStep: JourneyStepNode
};

const journeyNodes: Node<JourneyStepData>[] = [
    {
        id: 'step-1',
        type: 'journeyStep',
        position: { x: 100, y: 100 },
        data: {
            id: 'login-form',
            label: 'User Login',
            stepNumber: 1,
            description: 'User enters credentials',
            screenshot: '/screenshots/login.png',
            onClick: (stepData) => {
                console.log('Step clicked:', stepData);
            }
        }
    }
];

function JourneyFlow() {
    return (
        <ReactFlow
            nodes={journeyNodes}
            nodeTypes={nodeTypes}
            fitView
        />
    );
}
```

### Using the Helper Function

```tsx
import { createJourneyStepNode } from './components/graph/nodes';

const stepNode = createJourneyStepNode('my-step', { x: 0, y: 0 }, {
    label: 'My Step',
    stepNumber: 1,
    screenshot: '/path/to/screenshot.png'
});
```

## Props

### JourneyStepData

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | ✅ | Unique identifier for the step |
| `label` | `string` | ✅ | Display name of the step |
| `stepNumber` | `number` | ❌ | Optional step number for sequential flows |
| `description` | `string` | ❌ | Additional description text |
| `screenshot` | `string` | ❌ | URL/path to screenshot image |
| `onClick` | `(stepData: JourneyStepData) => void` | ❌ | Click handler function |

### JourneyStepNodeProps

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `JourneyStepData` | - | Step data object |
| `isConnectable` | `boolean` | `true` | Whether handles can be connected |
| `targetPosition` | `Position` | `Position.Top` | Position of input handle |
| `sourcePosition` | `Position` | `Position.Bottom` | Position of output handle |

## Visual States

### Default State
- Clean card layout with shadow
- Blue step number badge (if provided)
- Screenshot thumbnail (if available)
- Step name and description

### Hover State
- Increased shadow and slight scale transform
- Blue border highlight
- Screenshot overlay with "Click to view" text
- Enhanced step number badge

### Error State
- Fallback UI when screenshot fails to load
- Graceful degradation with icon placeholder

## Styling

The component uses TailwindCSS for styling with the following key classes:

- **Container**: `bg-white border-2 rounded-lg shadow-md`
- **Hover**: `border-blue-400 shadow-lg transform scale-105`
- **Badge**: `bg-blue-500 text-white rounded-full`
- **Image**: `w-full h-32 object-cover object-top`

## Accessibility

- **Role**: `button` for interactive elements
- **ARIA Labels**: Descriptive labels for screen readers
- **Keyboard Navigation**: `tabIndex="0"` for focus management
- **Alt Text**: Meaningful image descriptions

## Examples

### Simple Step
```tsx
{
    id: 'step-1',
    type: 'journeyStep',
    data: {
        id: 'welcome',
        label: 'Welcome Screen'
    }
}
```

### Complete Step with All Features
```tsx
{
    id: 'step-2',
    type: 'journeyStep',
    data: {
        id: 'profile-setup',
        label: 'Profile Setup',
        stepNumber: 2,
        description: 'Complete your profile information',
        screenshot: '/screenshots/profile-form.png',
        onClick: (stepData) => {
            // Open detailed view
            openStepModal(stepData);
        }
    }
}
```

### Error Handling
```tsx
// Screenshot will show fallback UI if image fails to load
{
    id: 'step-3',
    type: 'journeyStep',
    data: {
        id: 'broken-image',
        label: 'Step with Broken Image',
        screenshot: '/non-existent-image.png' // Will show fallback
    }
}
```

## Integration with ReactFlow

The component is designed to work seamlessly with ReactFlow:

1. **Handles**: Automatic input/output connection points
2. **Positioning**: Supports ReactFlow's positioning system
3. **Selection**: Works with ReactFlow's selection system
4. **Dragging**: Supports ReactFlow's drag functionality

## Best Practices

1. **Screenshots**: Use consistent aspect ratios for better visual harmony
2. **Labels**: Keep step names concise (3-7 words)
3. **Numbering**: Use sequential numbers for linear flows
4. **Click Handlers**: Provide meaningful interactions (modals, navigation)
5. **Error Handling**: Always handle screenshot loading failures gracefully

## Troubleshooting

### Images Not Loading
- Ensure image paths are correct and accessible
- Check CORS settings for external images
- Verify image formats are supported (PNG, JPG, WebP)

### Styling Issues
- Ensure TailwindCSS is properly configured
- Check for conflicting CSS rules
- Verify custom styles don't override component classes

### TypeScript Errors
- Import types from the correct path: `./components/types`
- Ensure onClick handlers match the expected signature
- Verify all required props are provided