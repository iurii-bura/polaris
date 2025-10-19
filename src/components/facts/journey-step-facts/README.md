# Journey Step Facts Component

A React component that displays journey step information in the component details panel. This component follows the same visual language and patterns as other fact cards in the application.

## Features

- 📸 **Large Screenshot Display**: Shows an enlarged view of the journey step screenshot
- 📝 **Step Information**: Displays step name and detailed description
- 🔽 **Expandable Interface**: Follows the same expand/collapse pattern as other fact components
- 🎨 **Consistent Styling**: Uses the same visual design language as other fact cards

## Usage

The component is automatically rendered when a component has `journeyStep` facts in its data:

```json
{
    "id": "example-component",
    "label": "Example Component",
    "description": "Component description",
    "facts": {
        "journeyStep": {
            "name": "Login Form",
            "screenshot": "https://example.com/screenshot.png",
            "description": "Detailed description of the journey step..."
        }
        // ... other facts
    }
}
```

## Props

### JourneyStepFactsProps

| Property           | Type               | Required | Description              |
| ------------------ | ------------------ | -------- | ------------------------ |
| `journeyStepFacts` | `JourneyStepFacts` | ✅       | Journey step data object |

### JourneyStepFacts Type

| Property      | Type     | Required | Description                      |
| ------------- | -------- | -------- | -------------------------------- |
| `name`        | `string` | ✅       | Display name of the journey step |
| `screenshot`  | `string` | ✅       | URL to the screenshot image      |
| `description` | `string` | ✅       | Detailed description of the step |

## Visual Design

### Header Section

- 🗺️ **Map Icon**: Visual identifier for journey steps
- **Title**: "Journey Step"
- **Expand/Collapse Button**: Standard chevron icons

### Content Sections

1. **Step Information**
    - 📄 **File Text Icon**: Section identifier
    - **Step Name**: Prominently displayed with primary color
    - **Description**: Full description with proper text formatting

2. **Screenshot Display**
    - 🖼️ **Image Icon**: Section identifier
    - **Large Image**: Full-width screenshot with proper aspect ratio
    - **Image Caption**: Step name and type indicator
    - **Error Handling**: Graceful fallback when image fails to load

## Screenshot Error Handling

The component includes robust error handling for screenshot loading:

- **Fallback UI**: Shows camera icon with error message
- **Graceful Degradation**: Maintains layout when image fails
- **User Feedback**: Clear indication that screenshot is unavailable

## Integration

The component is automatically integrated into the component details panel when:

1. A component has `journeyStep` facts in its data
2. The facts contain valid `name`, `screenshot`, and `description` fields
3. The component is selected in the application

## Testing Screenshots

For testing purposes, you can use placeholder URLs:

```json
{
    "screenshot": "https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Login+Form+Screenshot"
}
```

The component supports various image formats and aspect ratios, automatically adjusting the display to fit the container while maintaining proper proportions.

## Accessibility

- **Alt Text**: Automatically generated based on step name
- **Semantic HTML**: Proper heading and section structure
- **Screen Reader Support**: Compatible with assistive technologies
- **Keyboard Navigation**: Supports standard keyboard interactions
