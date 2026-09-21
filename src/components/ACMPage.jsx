import React, { useState } from 'react';
import WarpAnimate from './WarpAnimate';

const NAV_ITEMS = [
  {
    name: 'ABOUT',
    detail: 'WHO WE ARE',
    body: {
      heading: 'ABOUT',
      code: '001',
      content: (
        <>
          <p style={{ fontSize: '12px', lineHeight: '1.7', margin: '0 0 10px 0' }}>
            The UNCG ACM Student Chapter promotes interest and knowledge in
            computing and provides opportunities for students to connect,
            learn, and engage with others who share an interest in computer
            science and its applications. Chartered by ACM, the chapter
            serves UNCG students and other interested members of the
            community while fostering an inclusive and welcoming environment.
          </p>
        </>
      ),
    },
  },
  {
    name: 'EVENTS',
    detail: 'MEETINGS / WORKSHOPS',
    body: {
      heading: 'EVENTS',
      code: '002',
      content: (
        <p style={{ fontSize: '12px', lineHeight: '1.7', margin: 0 }}>
          Weekly meetings, workshops, and hackathons — check back here for
          the current semester's schedule.
        </p>
      ),
    },
  },
  {
    name: 'PROJECTS',
    detail: 'WHAT WE BUILD',
    body: {
      heading: 'PROJECTS',
      code: '003',
      content: (
        <p style={{ fontSize: '12px', lineHeight: '1.7', margin: 0 }}>
          A rotating set of member-led projects, from web apps to research
          tools, built collaboratively throughout the year.
        </p>
      ),
    },
  },
  {
    name: 'TEAM',
    detail: 'OFFICERS & MEMBERS',
    body: {
      heading: 'TEAM',
      code: '004',
      content: (
        <p style={{ fontSize: '12px', lineHeight: '1.7', margin: 0 }}>
          Meet the officers and members who run the chapter and organize
          events each semester.
        </p>
      ),
    },
  },
  {
    name: 'RESOURCES',
    detail: 'LEARN / PRACTICE',
    body: {
      heading: 'RESOURCES',
      code: '005',
      content: (
        <p style={{ fontSize: '12px', lineHeight: '1.7', margin: 0 }}>
          Curated links, past workshop slides, and practice material for
          interviews and coursework.
        </p>
      ),
    },
  },
  {
    name: 'CONTACT',
    detail: 'GET IN TOUCH',
    body: {
      heading: 'CONTACT',
      code: '006',
      content: (
        <p style={{ fontSize: '12px', lineHeight: '1.7', margin: 0 }}>
          Reach the chapter at{' '}
          <span style={{ color: '#dbe6e3' }}>acm@uncg.edu</span>.
        </p>
      ),
    },
  },
];

export default function GeocitiesHome() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = NAV_ITEMS[activeIndex] || NAV_ITEMS[0];

  const wedgeOffsets = [0, 50, 118];

  return (
    <div id="geocities-home">
      <style>{`
        #geocities-home{
          position:relative;
          background-color:#0a0c0b;
          color:#a2aca8;
          font-family:"Courier New",Courier,monospace;
          min-height:600px;
          padding:20px;
          box-sizing:border-box;
          overflow:hidden;
        }
        #geocities-home::after{
          content:"";
          position:absolute;
          inset:0;
          opacity:.45;
          pointer-events:none;
          mix-blend-mode:overlay;
          z-index:1;
          background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
        }
        #geocities-home .gh-inner{ position:relative; z-index:2; }

        #geocities-home .gh-bg{
          position:absolute;
          inset:0;
          z-index:0;
          overflow:hidden;
          background-image: repeating-linear-gradient(98deg,
            #aab6b2 0px, #dfe6e3 14px, #7e8c88 28px, #c4cdc9 44px, #94a19d 58px);
          filter: saturate(.85) contrast(1.05);
        }
        #geocities-home .gh-wedge{
          position:absolute;
          top:-10%; bottom:-10%;
          left:0; width:100%;
          clip-path: polygon(34% 0, 56% 0, 44% 100%, 22% 100%);
          background:linear-gradient(165deg, #0c1f24 0%, #021314 40%, #050c0e 100%);
        }
        #geocities-home .gh-wedge-fringe{
          position:absolute;
          top:-10%; bottom:-10%;
          left:0; width:100%;
          clip-path: polygon(34% 0, 56% 0, 44% 100%, 22% 100%);
          mix-blend-mode:screen;
          pointer-events:none;
        }
        #geocities-home .gh-wedge-fringe.r{ background:rgba(255,50,50,.28); transform:translateX(2px); }
        #geocities-home .gh-wedge-fringe.c{ background:rgba(0,220,230,.28); transform:translateX(-2px); }
        
        #geocities-home .gh-wedge-group{
          position:absolute;
          top:-10%; bottom:-10%;
          width:300%;
          transform: translateX(-50%);
        }
        #geocities-home .gh-wedge-group .gh-wedge,
        #geocities-home .gh-wedge-group .gh-wedge-fringe{
          position:absolute;
          inset:0;
        }

        #geocities-home .gh-scrim{
          background:rgba(7,9,8,.6);
          backdrop-filter:blur(2px);
          padding:12px 16px;
          border:1px solid #262e2c;
        }

        #geocities-home .gh-header{
          text-align:center;
          margin-bottom:20px;
        }
        #geocities-home .gh-tag{
          display:inline-block;
          font-size:10px;
          letter-spacing:.2em;
          color:#7e8c88;
          border:1px solid #262e2c;
          padding:2px 8px;
          margin-bottom:10px;
        }

        #geocities-home .gh-glitch{
          position:relative;
          display:inline-block;
          color:#e6ece9;
          font-family:"Verdana",sans-serif;
          font-weight:bold;
          font-size:clamp(18px, 3.2vw, 30px);
          margin:0 0 6px 0;
          letter-spacing:3px;
          text-transform:uppercase;
        }

        #geocities-home .gh-sub{
          color:#8c9a96;
          margin:0;
          font-size:12px;
          letter-spacing:.15em;
        }

        #geocities-home .gh-layout{
          display:flex;
          gap:18px;
          align-items:flex-start;
          flex-wrap:wrap;
        }
        #geocities-home aside{ flex:1 1 220px; max-width:220px; }
        #geocities-home main{ flex:2 1 360px; min-width:0; }

        #geocities-home .gh-panel{
          position:relative;
          border:1px solid #262e2c;
          background-color:#0e100f;
          padding:16px;
          clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
        }
        #geocities-home .gh-panel-head{
          display:flex;
          justify-content:space-between;
          align-items:baseline;
          margin-bottom:12px;
          padding-bottom:8px;
        }
        #geocities-home .gh-panel-title{
          color:#e6ece9;
          font-weight:bold;
          font-size:13px;
          letter-spacing:.15em;
        }
        #geocities-home .gh-footer{
          margin-top:20px;
          overflow:hidden;
          text-align: center;
        }
        #geocities-home .gh-footer.gh-scrim{
          padding:10px 16px;
        }
        #geocities-home .gh-ticker{
          display:inline-block;
          white-space:nowrap;
          font-size:10px;
          letter-spacing:.1em;
          color:#95b3b0;
          text-align: center;
        }
      `}</style>

      <div className="gh-bg">
        {wedgeOffsets.map((left) => (
          <div key={left} className="gh-wedge-group" style={{ left: `${left}%` }}>
            <div className="gh-wedge" />
            <div className="gh-wedge-fringe r" />
            <div className="gh-wedge-fringe c" />
          </div>
        ))}
      </div>

      <div className="gh-inner">
        <div className="gh-header gh-scrim">
          <h1
            className="gh-glitch"
            data-text="Association of Computing Machinery"
          >
            Association of Computing Machinery
          </h1>
          <p className="gh-sub">THE UNCG CHAPTER OF ACM</p>
        </div>

        <div className="gh-layout">
          <aside>
            <WarpAnimate
              items={NAV_ITEMS}
              initialIndex={0}
              onNavigate={(index) => setActiveIndex(index)}
            />
          </aside>

          <main>
            <div className="gh-panel">
              <div className="gh-panel-head">
                <span className="gh-panel-title">{active.body.heading}</span>
              </div>
              {active.body.content}
            </div>
          </main>
        </div>

        <div className="gh-footer gh-scrim">
          <div className="gh-ticker">
            <span>BUGS / ISSUES → crtuttle2@uncg.edu</span>
          </div>
        </div>
      </div>
    </div>
  );
}
