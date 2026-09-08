import React, { useState, useEffect } from 'react';

export default function Taskbar({ 
  windows = [], 
  activeId, 
  onToggleWindow,
  crtEnabled,
  onToggleCrt
}) {
  const [startOpen, setStartOpen] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {startOpen && (
        <div
          className="window"
          style={{
            position: 'fixed',
            bottom: '30px',
            left: '2px',
            zIndex: 9999,
            display: 'flex',
            minWidth: '180px',
            padding: 0,
            boxShadow: '2px -2px 0px black',
          }}
        >
          <div
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              background: 'linear-gradient(to top, #000080, #1084d0)',
              color: '#ffffff',
              fontWeight: 'bold',
              letterSpacing: '2px',
              padding: '8px 4px',
              fontSize: '14px',
              fontFamily: 'sans-serif',
            }}
          >
            Doors<b>99</b>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '2px', backgroundColor: '#c0c0c0' }}>
            <button
              className="start-menu-item"
              onClick={() => {
                onToggleCrt();
                setStartOpen(false);
              }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
            >
              <span>CRT Scanlines</span>
              <span style={{ fontSize: '10px', color: crtEnabled ? '#008000' : '#888'}}>
                [{crtEnabled ? 'ON' : 'OFF'}]
              </span>
            </button>
            <hr style={{ margin: '4px 0', border: '1px inset #fff' }} />
            <button
              className="start-menu-item"
              onClick={() => window.location.reload()}
            >
              Restart...
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '28px',
          backgroundColor: '#c0c0c0',
          borderTop: '2px solid #ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2px 4px',
          zIndex: 9998,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', gap: '4px', height: '100%', alignItems: 'center' }}>
          <button
            aria-pressed={startOpen}
            onClick={() => setStartOpen(!startOpen)}
            style={{ fontWeight: 'bold', height: '22px', padding: '0 6px' }}
          >
            Start
          </button>

          {windows.filter((win) => win.isOpen).map((win) => {
            const isTabActive = activeId === win.id && !win.isMinimized;
            return (
              <button
                key={win.id}
                aria-pressed={isTabActive}
                onClick={() => onToggleWindow(win.id)}
                style={{
                  height: '22px',
                  fontSize: '11px',
                  maxWidth: '140px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontWeight: isTabActive ? 'bold' : 'normal',
                }}
              >
                {win.title}
              </button>
            );
          })}
        </div>

        <div
          className="status-bar-field"
          style={{ height: '20px', display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: '11px', margin: 0 }}
        >
          {time}
        </div>
      </div>
    </>
  );
}
