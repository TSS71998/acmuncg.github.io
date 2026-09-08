import React, {useState} from 'react';

export default function DesktopIcon({title, icon, onOpen}) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div
      onClick={() => setIsSelected(true)}
      onBlur={() => setIsSelected(false)}
      onDoubleClick={onOpen}
      tabIndex={0}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '74px',
        padding: '6px 4px',
        cursor: 'pointer',
        userSelect: 'none',
        outline: 'none',
        marginBottom: '10px',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          lineHeight: '1',
          marginBottom: '2px',
          filter: isSelected ? 'drop-shadow(1px 1px 0px #000080)' : 'none',
        }}
      >
        {typeof icon === 'string' && icon.includes('.') ? (
          <img
            src={icon}
            alt={title}
            style={{
              width: '48px',
              height: '48px',
              imageRendering: 'pixelated',
              pointerEvents: 'none',
            }}
          />
        ) : (
          icon
        )}
      </div>

      <span
        style={{
          color: '#ffffff',
          fontSize: '11px',
          lineHeight: '1.2',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          workBreak: 'break-word',
          padding: '0 6px',
          background: isSelected ? '#000080' : '#018281',
          broder: isSelected ? '1px dotted #ffff84' : '1px solid transparent'
        }}
      >
        {title}
      </span>
    </div>
  )
}
