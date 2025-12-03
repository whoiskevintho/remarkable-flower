# Recharts Tooltip Customization Guide

## Overview
Recharts provides extensive customization options for tooltips. You can either use built-in props or create a completely custom tooltip component.

## Built-in Tooltip Props

### Basic Styling
```jsx
<Tooltip
  // Cursor line that follows the mouse
  cursor={{ stroke: '#f2f2f2', strokeWidth: 1, strokeDasharray: '3 3' }}
  
  // Distance from chart element
  offset={10}
  
  // Fixed position (optional)
  position={{ x: 100, y: 100 }}
  
  // Allow tooltip to escape chart bounds
  allowEscapeViewBox={{ x: true, y: true }}
  
  // Separator between label and value (default: ' : ')
  separator=" : "
  
  // Inline styles
  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', padding: '12px' }}
  itemStyle={{ color: '#e0e0e0', fontSize: '13px' }}
  labelStyle={{ color: '#fff', fontWeight: 600 }}
  wrapperStyle={{ outline: 'none' }}
  
  // Animation
  animationDuration={200}  // milliseconds
  isAnimationActive={true}
/>
```

### Formatters (for default tooltip)
```jsx
<Tooltip
  // Format the value display
  formatter={(value, name, props) => {
    return [`${value.toFixed(2)} mm`, name]
  }}
  
  // Format the label
  labelFormatter={(label) => `Axis: ${label}`}
/>
```

## Custom Tooltip Component

### Available Props
When creating a custom tooltip component, you receive these props:

```jsx
const CustomTooltip = ({ 
  active,      // Boolean - is tooltip active?
  payload,     // Array - data for all series at this point
  label,       // String/Number - the label (x-axis value)
  coordinate,  // Object - { x, y } cursor position
  viewBox,     // Object - chart viewBox dimensions
  formatter,   // Function - formatter function (if provided)
  labelFormatter // Function - label formatter (if provided)
}) => {
  // payload structure:
  // [
  //   {
  //     dataKey: 'speciesName',
  //     value: 0.75,
  //     color: '#E63946',
  //     payload: { /* full data point */ },
  //     name: 'speciesName'
  //   },
  //   ...
  // ]
  
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}
```

### Usage
```jsx
<Tooltip content={<CustomTooltip />} />
```

## Advanced Examples

### Tooltip with Coordinate-Based Positioning
```jsx
const CustomTooltip = ({ active, payload, label, coordinate }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        style={{
          position: 'absolute',
          left: coordinate.x + 10,
          top: coordinate.y - 50,
          // ... styles
        }}
      >
        {/* tooltip content */}
      </div>
    )
  }
  return null
}
```

### Conditional Tooltip Display
```jsx
const CustomTooltip = ({ active, payload }) => {
  // Only show if value is above threshold
  if (active && payload && payload.some(entry => entry.value > 0.5)) {
    return <div>...</div>
  }
  return null
}
```

### Tooltip with Multiple Data Points
```jsx
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Group by category
    const grouped = payload.reduce((acc, entry) => {
      const category = entry.payload.category
      if (!acc[category]) acc[category] = []
      acc[category].push(entry)
      return acc
    }, {})
    
    return (
      <div>
        <h4>{label}</h4>
        {Object.entries(grouped).map(([category, entries]) => (
          <div key={category}>
            <strong>{category}</strong>
            {entries.map(entry => (
              <div key={entry.dataKey}>{entry.name}: {entry.value}</div>
            ))}
          </div>
        ))}
      </div>
    )
  }
  return null
}
```

## Tips

1. **Performance**: Use `useMemo` for expensive tooltip calculations
2. **Accessibility**: Include proper ARIA labels and keyboard navigation
3. **Mobile**: Consider larger touch targets and simpler tooltips on mobile
4. **Styling**: Use CSS classes for better maintainability than inline styles
5. **Positioning**: Use `coordinate` prop for dynamic positioning based on cursor

