function TagLabel({ label, color = '#fff' }) {
  return (
    <div style={{ 
      padding: '8px 12px', 
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      color: color
    }}>
      {label}
    </div>
  )
}

export default TagLabel

