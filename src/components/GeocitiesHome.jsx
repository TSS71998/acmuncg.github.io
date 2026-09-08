import React, { useState } from 'react';

export default function GeocitiesHome() {
  // You can easily push new events to this array or load them from a JSON file / API
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Event 1',
      club: 'Club 1',
      date: 'OCT 14',
      time: '18:00 EST',
      loc: 'Petty 219',
    },
    {
      id: 2,
      title: 'Event 2',
      club: 'Club 2',
      date: 'OCT 22',
      time: '09:00 EST',
      loc: 'Petty 222',
    },
    {
      id: 3,
      title: 'Event 3',
      club: 'Club 3',
      date: 'NOV 03',
      time: '19:30 EST',
      loc: 'Petty 217',
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    club: '',
    date: '',
    time: '',
    loc: '',
  });
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.date.trim()) return;

    setEvents([
      ...events,
      {
        id: Date.now(),
        title: newEvent.title,
        club: newEvent.club || 'General CS',
        date: newEvent.date.toUpperCase(),
        time: newEvent.time || 'TBD',
        loc: newEvent.loc || 'Petty',
      },
    ]);

    setNewEvent({ title: '', club: '', date: '', time: '', loc: '' });
    setShowAddModal(false);
  };

  return (
    <div
      style={{
        backgroundColor: '#05070a',
        color: '#d4d4d4',
        fontFamily: '"Courier New", Courier, monospace',
        minHeight: '100%',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          backgroundColor: '#000080',
          color: '#ffffff',
          fontWeight: 'bold',
          padding: '4px 0',
          border: '2px solid #ffff00',
          marginBottom: '16px',
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'inline-block', animation: 'marquee 14s linear infinite' }}>
          ★ CHECK OUT ANY CLUB BY DOUBLE CLICKING ON THEIR ICON ON THE DESKTOP ★
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1
          style={{
            color: '#00ff66',
            textShadow: '3px 3px #ff0055',
            fontSize: 'clamp(20px, 3.5vw, 32px)',
            margin: '0 0 6px 0',
            letterSpacing: '2px',
          }}
        >
          ~*~ UNCG CS CLUB CENTER ~*~
        </h1>
        <p style={{ color: '#00ffff', margin: 0, fontSize: '13px' }}>
          The Unified Page for UNCG Computer Science Clubs
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            border: '2px dashed #00ffff',
            backgroundColor: '#0d131a',
            padding: '12px',
          }}
        >
          <div style={{ color: '#ffff00', fontWeight: 'bold', marginBottom: '8px' }}>
            [ ABOUT ]
          </div>
          <p style={{ fontSize: '12px', lineHeight: '1.6', margin: '0 0 10px 0' }}>
            The Computer Science Club Center operates as an umbrella hub representing all student-led computer science organizations on campus.
          </p>
          <div style={{ fontSize: '11px', color: '#888' }}>
            <b>Founding:</b> 2026
          </div>
        </div>

        <div
          style={{
            border: '2px dashed #ff007f',
            backgroundColor: '#0d131a',
            padding: '12px',
          }}
        >
          <div style={{ color: '#ff007f', fontWeight: 'bold', marginBottom: '8px' }}>
            [ CONTACT INFO ]
          </div>
          <div
            style={{
              backgroundColor: '#000',
              border: '1px solid #333',
              padding: '10px',
              fontSize: '12px',
              lineHeight: '1.8',
            }}
          >
            <div>
              <span style={{ color: '#00ff66' }}>E-Mail:</span>{' '}
              <a href="" style={{ color: '#00ffff' }}>
                
              </a>
            </div>
            <div>
              <span style={{ color: '#00ff66' }}>Discord:</span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          border: '2px solid #00ff66',
          backgroundColor: '#0d131a',
          padding: '14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ color: '#00ff66', fontWeight: 'bold', fontSize: '14px' }}>
            [ CALENDAR ]
          </div>
          <button
            onClick={() => setShowAddModal(!showAddModal)}
            style={{
              cursor: 'pointer',
              backgroundColor: '#00ff66',
              color: '#000',
              fontWeight: 'bold',
              border: 'none',
              padding: '4px 10px',
              fontFamily: 'monospace',
              fontSize: '11px',
            }}
          >
            {showAddModal ? '[-] Cancel' : '[+] Add Event'}
          </button>
        </div>

        {showAddModal && (
          <form
            onSubmit={handleAddEvent}
            style={{
              backgroundColor: '#000',
              border: '1px solid #ffff00',
              padding: '10px',
              marginBottom: '12px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '8px',
            }}
          >
            <input
              type="text"
              placeholder="Event Title *"
              required
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Hosting Club"
              value={newEvent.club}
              onChange={(e) => setNewEvent({ ...newEvent, club: e.target.value })}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Date"
              required
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Location"
              value={newEvent.loc}
              onChange={(e) => setNewEvent({ ...newEvent, loc: e.target.value })}
              style={inputStyle}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#ffff00',
                color: '#000',
                fontWeight: 'bold',
                cursor: 'pointer',
                border: 'none',
                fontFamily: 'monospace',
              }}
            >
              Confirm Entry
            </button>
          </form>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#000', borderBottom: '1px solid #444', color: '#ffea00' }}>
                <th style={{ padding: '6px' }}>DATE</th>
                <th style={{ padding: '6px' }}>EVENT / TOPIC</th>
                <th style={{ padding: '6px' }}>ORGANIZER</th>
                <th style={{ padding: '6px' }}>TIME</th>
                <th style={{ padding: '6px' }}>LOCATION</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr
                  key={ev.id}
                  style={{
                    borderBottom: '1px dotted #222',
                  }}
                >
                  <td style={{ padding: '8px 6px', color: '#ff007f', fontWeight: 'bold' }}>
                    {ev.date}
                  </td>
                  <td style={{ padding: '8px 6px', color: '#00bfdd', fontWeight: 'bold' }}>
                    {ev.title}
                  </td>
                  <td style={{ padding: '8px 6px', color: '#888888', fontWeight: 'bold' }}>
                    {ev.club}
                  </td>
                  <td style={{ padding: '8px 6px', color: '#888888', fontWeight: 'bold' }}>{ev.time}</td>
                  <td style={{ padding: '8px 6px', color: '#910000', fontWeight: 'bold' }}>{ev.loc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          borderTop: '1px solid #222',
          paddingTop: '12px',
          fontSize: '11px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span style={badgeStyle}>[ IF YOU ENCOUNTER ANY BUGS, CONTACT:  ]</span>
        </div>
        <div style={{ color: '#888' }}>
          TOTAL EVENTS LOGGED: {events.length}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  backgroundColor: '#111',
  border: '1px solid #555',
  color: '#fff',
  padding: '4px 6px',
  fontFamily: 'monospace',
  fontSize: '11px',
};

const badgeStyle = {
  border: '1px solid #444',
  padding: '2px 5px',
  fontSize: '10px',
  backgroundColor: '#000',
  color: '#888',
};
