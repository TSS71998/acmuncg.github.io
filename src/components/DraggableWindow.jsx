import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';

export default function DraggableWindow({
  title = 'Application',
  children,
  defaultPosition = { x: 20, y: 20 },
  centerOnMount = false,
  width = '420px',
  isMinimized = false,
  isActive = true,
  onClose,
  zIndex = 1,
  onFocus,
}) {
  const nodeRef = useRef(null);
  const [initPos, setInitPos] = useState(defaultPosition);
  const [isReady, setIsReady] = useState(!centerOnMount);

  useEffect(() => {
    if (centerOnMount && nodeRef.current) {
      const desktop = nodeRef.current.closest('.desktop-area') || {
        clientWidth: window.innerWidth,
        clientHeight: window.innerHeight - 28,
      };

      const winWidth = nodeRef.current.offsetWidth;
      const winHeight = nodeRef.current.offsetHeight;

      const centerX = Math.max(10, Math.round((desktop.clientWidth - winWidth) / 2));
      const centerY = Math.max(10, Math.round((desktop.clientHeight - winHeight) / 2));

      setInitPos({x: centerX, y: centerY});
      setIsReady(true);
    }
  }, [centerOnMount]);

  if (!isReady) {
    return (
      <div
        ref={nodeRef}
        className="window"
        style={{
          width: `min(${width}, calc(100vw - 32px))`,
          maxHeight: 'calc(100dvh - 60px',
          position: 'absolute',
          visibility: 'hidden',
        }}
      >
        <div className="title-bar">
          <div className="title-bar-text">{title}</div>
        </div>
        <div className="window-body">{children}</div>
      </div>
    );
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".title-bar"
      defaultPosition={initPos}
      bounds=".desktop-area"
      onStart={onFocus}
    >
      <div
        ref={nodeRef}
        onMouseDownCapture={onFocus}
        className="window"
        style={{
          width: `min(${width}, calc(100vw - 32px))`,
          maxHeight: 'calc(100dvh - 60px)',
          position: 'absolute',
          display: isMinimized ? 'none':'flex',
          flexDirection: 'column',
          zIndex,
          userSelect: 'none',
          boxShadow: '2px 2px 0px black',
        }}
      >
        <div className={`title-bar ${isActive ? '' : 'inactive'}`}style={{ cursor: 'move', flexShrink: 0 }}>
          <div className="title-bar-text">{title}</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" onClick={onClose} />
            <button aria-label="Maximize" />
            <button aria-label="Close" onClick={onClose} />
          </div>
        </div>

        <div className="window-body" 
          style={{
            margin: 0,
            padding: '12px',
            overflowY: 'auto',
            userSelect: 'text',
            flexGrow: 1,
          }}
        >
          {children}
        </div>
      </div>
    </Draggable>
  );
}
