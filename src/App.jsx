import { useState, useEffect } from 'react';
import DraggableWindow from './components/DraggableWindow';
import Taskbar from './components/Taskbar';
import DesktopIcon from './components/DesktopIcon'
import GeocitiesHome from './components/GeocitiesHome'
import Minesweeper from './components/Minesweeper'

const APPS = [
  {
    id: 'home',
    title: 'Home Page',
    icon: '🌐',
    width: '90%',
    centerOnMount: true,
    component: <GeocitiesHome />,
  },
  {
    id: 'acm',
    title: 'ACM',
    icon: '📝',
    width: '360px',
    defaultPosition: {x:  120, y: 80},
    component: (
      <div>
        <p><b>ACM</b></p>
      </div>
    ),
  },
  {
    id: 'robo',
    title: 'Robotics',
    icon: '📝',
    width: '360px',
    defaultPosition: {x:  130, y: 90},
    component: (
      <div>
        <p><b>Robotics</b></p>
      </div>
    ),
  },
  {
    id: 'comp',
    title: 'Competitive Coding',
    icon: '📝',
    width: '360px',
    defaultPosition: {x:  140, y: 100},
    component: (
      <div>
        <p><b>Competitive Coding</b></p>
      </div>
    ),
  },
  {
    id: 'leet',
    title: 'LeetClub',
    icon: '📝',
    width: '360px',
    defaultPosition: {x:  150, y: 110},
    component: (
      <div>
        <p><b>LeetClub</b></p>
      </div>
    ),
  },
  {
    id: 'gwc',
    title: 'Girls Who Code',
    icon: '📝',
    width: '360px',
    defaultPosition: {x:  160, y: 120},
    component: (
      <div>
        <p><b>Girls Who Code</b></p>
      </div>
    ),
  },
  {
    id: 'info',
    title: 'InfoSec',
    icon: '📝',
    width: '360px',
    defaultPosition: {x:  170, y: 130},
    component: (
      <div>
        <p><b>InfoSec</b></p>
      </div>
    ),
  },
  {
    id: 'game',
    title: 'Game Dev',
    icon: '📝',
    width: '360px',
    defaultPosition: {x:  180, y: 140},
    component: (
      <div>
        <p><b>Game Dev</b></p>
      </div>
    ),
  },
  {
    id: 'mine',
    title: 'Minesweeper',
    icon: `${import.meta.env.BASE_URL}bomb_icon.png`,
    width: '210px',
    defaultPosition: {x: 260, y: 120},
    component: <Minesweeper/>,
  },
];

export default function App() {
  const [activeId, setActiveId] = useState('home');
  const [topZIndex, setTopZIndex] = useState(10);
  const [crtEnabled, setCRTEnabled] = useState(false);

  const [windowStates, setWindowStates] = useState({
    home: {isOpen: true, isMinimized: false, zIndex: 10},
    acm: {isOpen: false, isMinimized: false, zIndex: 1},
    mine: {isOpen: false, isMinimized: false, zIndex: 1},
  });

  useEffect(() => {
    if (crtEnabled) {
      document.body.classList.add('crt-filter-active');
    } else {
      document.body.classList.remove('crt-filter-active');
    }
  }, [crtEnabled]);

  const openOrFocusApp = (id) => {
    setActiveId(id);
    setTopZIndex((prevZ) => {
      const nextZ = prevZ + 1;
      setWindowStates((prevStates) => ({
        ...prevStates,
        [id]: {isOpen: true, isMinimized: false, zIndex: nextZ},
      }));
      return nextZ;
    });
  };

  const handleTaskbarClick = (id) => {
    const current = windowStates[id];

    if (activeId === id && !current.isMinimized) {
      setWindowStates((prev) => ({
        ...prev,
        [id]: {...prev[id], isMinimized: true},
      }));
      setActiveId(null);
    } else {
      openOrFocusApp(id);
    }
  };

  const closeWindow = (id) => {
    setWindowStates((prev) => ({
      ...prev,
      [id]: {...prev[id], isOpen: false, isMinimized: false},
    }));
    if (activeId === id) setActiveId(null);
  };

  const taskbarWindows = APPS.map((app) => ({
    id: app.id,
    title: app.title,
    isOpen: windowStates[app.id]?.isOpen,
    isMinimized:windowStates[app.id]?.isMinimized,
  }));

  return (
    <div style={{ width: '100vw', height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div
        className="desktop-area"
        style={{
          position: 'relative',
          width: '100%',
          height: 'calc(100dvh - 28px)',
          overflow: 'hidden',
        }}
      >
        <div style={{display: 'flex', flexDirection: 'column', zIndex: 0, position: 'relative'}}>
          {APPS.filter((a) => a.id !== 'mine').map((app) => (
          <DesktopIcon
            key={app.id}
            title={app.title.split(' - ')[0]}
            icon={app.icon}
            onOpen={() => openOrFocusApp(app.id)}
          />
          ))}
        </div>

        <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 0 }}>
          <DesktopIcon
            title="Minesweeper"
            icon={`${import.meta.env.BASE_URL}bomb_icon.png`}
            onOpen={() => openOrFocusApp('mine')}
          />
        </div>
      </div>

      {APPS.map((app) => {
        const state = windowStates[app.id];
          if (!state?.isOpen) return null;

          return (
            <DraggableWindow
              key={app.id}
              title={app.title}
              width={app.width}
              centerOnMount={app.centerOnMount}
              defaultPosition={app.defaultPosition || { x: 30, y: 30 }}
              isMinimized={state.isMinimized}
              zIndex={state.zIndex}
              isActive={activeId === app.id}
              onFocus={() => openOrFocusApp(app.id)}
              onClose={() => closeWindow(app.id)}
            >
              {app.component}
            </DraggableWindow>
          );
      })}

      <Taskbar
        windows={taskbarWindows}
        activeId={activeId}
        onToggleWindow={handleTaskbarClick}
        crtEnabled={crtEnabled}
        onToggleCrt={() => setCRTEnabled((prev) => !prev)}
      />
    </div>
  );
}
