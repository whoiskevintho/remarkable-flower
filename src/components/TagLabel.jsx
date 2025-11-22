function TagLabel({ label, color = '#fff' }) {
  return (
    <div style={{ 
      padding: '8px 12px', 
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      color: color,
      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
    }}>
      {label}
    </div>
  )
}

export default TagLabel

