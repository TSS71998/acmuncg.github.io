import { useEffect, useRef } from "react";

const FRONT_LEFT = 4;
const REST_WIDTH = 28;
const MAX_EXTEND = 150;
const FRONT_TOP = 14;
const FRONT_BOTTOM = 58;
const DEPTH = 14;

const WAVE_STEP_MS = 90;

export default function WarpRollover(props) {
  const items = (props && props.items);
  const initialIndex = props && typeof props.initialIndex === "number" ? props.initialIndex : 0;
  const onNavigate = props ? props.onNavigate : undefined;

  const NAMES = items.map((it) => it.name);
  const DETAILS = items.map((it) => it.detail);
  const LINKS = items.map((it) => it.href);

  const rootRef = useRef(null);
  const rowRef = useRef(null);
  const nameRef = useRef(null);
  const detailRef = useRef(null);
  const blockRefs = useRef([]);

  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;

  useEffect(() => {
    const row = rowRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");

    let hovered = -1;
    let selected = -1;
    let active = -1;
    let frame = 0;
    let last = 0;
    let waveTimeout = null;

    const extents = NAMES.map(() => 0);
    const blocks = blockRefs.current.map((button) => [
      ...button.querySelectorAll("polygon"),
    ]);

    function draw(i) {
      const w = extents[i];
      const frontRight = FRONT_LEFT + REST_WIDTH + w;

      // End cap
      blocks[i][0].setAttribute(
        "points",
        `${frontRight},${FRONT_TOP} ${frontRight + DEPTH},${FRONT_TOP - DEPTH} ${frontRight + DEPTH},${FRONT_BOTTOM - DEPTH} ${frontRight},${FRONT_BOTTOM}`
      );
      // Front face
      blocks[i][1].setAttribute(
        "points",
        `${FRONT_LEFT},${FRONT_TOP} ${frontRight},${FRONT_TOP} ${frontRight},${FRONT_BOTTOM} ${FRONT_LEFT},${FRONT_BOTTOM}`
      );
      // Top bevel
      blocks[i][2].setAttribute(
        "points",
        `${FRONT_LEFT},${FRONT_TOP} ${FRONT_LEFT + DEPTH},${FRONT_TOP - DEPTH} ${frontRight + DEPTH},${FRONT_TOP - DEPTH} ${frontRight},${FRONT_TOP}`
      );
      blocks[i][2].setAttribute("fill", active === i ? "#cad2d0" : "#42504c");
    }

    function animate(t) {
      const dt = last ? Math.min(48, t - last) : 16;
      last = t;
      let moving = false;

      extents.forEach((w, i) => {
        const target = active === i ? MAX_EXTEND : 0;
        extents[i] = reduced.matches
          ? target
          : w + (target - w) * (1 - Math.exp(-dt / (target ? 65 : 130)));
        if (Math.abs(target - extents[i]) < 0.1) extents[i] = target;
        else moving = true;
        draw(i);
      });

      if (moving) frame = requestAnimationFrame(animate);
      else {
        frame = 0;
        last = 0;
      }
    }

    function applyActive(i) {
      active = i;
      nameRef.current.textContent = i < 0 ? "ACM-OS" : "ACM / " + NAMES[i];
      detailRef.current.textContent =
        i < 0 ? "INTERACTIVE NAVIGATION" : DETAILS[i];
      blockRefs.current.forEach((button, idx) => {
        button.dataset.active = String(idx === active);
        button.dataset.selected = String(idx === selected);
        button.setAttribute("aria-current", idx === selected ? "page" : "false");
      });
      if (!frame) frame = requestAnimationFrame(animate);
    }

    function cancelWave() {
      if (waveTimeout) {
        clearTimeout(waveTimeout);
        waveTimeout = null;
      }
    }

    function startWave(from, to) {
      cancelWave();
      if (reduced.matches || from === to) {
        applyActive(to);
        return;
      }
      let current = from;
      const dir = from < to ? 1 : -1;
      const step = () => {
        applyActive(current);
        if (current === to) {
          waveTimeout = null;
          return;
        }
        current += dir;
        waveTimeout = setTimeout(step, WAVE_STEP_MS);
      };
      step();
    }

    function handleHover(i) {
      cancelWave();
      hovered = i;
      applyActive(i);
    }

    function handleSelect(i) {
      cancelWave();
      selected = i;
      hovered = i;
      applyActive(i);
      const href = LINKS[i];
      if (typeof onNavigateRef.current === "function") {
        onNavigateRef.current(i, items[i]);
      } else if (href) {
        window.location.hash = href;
      }
    }

    function leave() {
      const from = hovered;
      hovered = -1;
      if (from !== -1 && selected !== -1 && from !== selected) {
        startWave(from, selected);
      } else {
        cancelWave();
        applyActive(selected);
      }
    }

    const cleanups = [];
    blockRefs.current.forEach((button, i) => {
      const enter = () => handleHover(i);
      const click = () => handleSelect(i);
      button.addEventListener("pointerenter", enter);
      button.addEventListener("focus", enter);
      button.addEventListener("click", click);
      cleanups.push(() => {
        button.removeEventListener("pointerenter", enter);
        button.removeEventListener("focus", enter);
        button.removeEventListener("click", click);
      });
    });

    const focusOut = (e) => {
      if (!row.contains(e.relatedTarget)) activate(-1);
    };
    row.addEventListener("pointerleave", leave);
    row.addEventListener("focusout", focusOut);

    extents.forEach((_, i) => draw(i));

    if (initialIndex >= 0 && initialIndex < NAMES.length) {
      selected = initialIndex;
      applyActive(initialIndex);
      if (typeof onNavigateRef.current === "function") {
        onNavigateRef.current(initialIndex, items[initialIndex]);
      }
    } else {
      applyActive(-1);
    }

    return () => {
      cleanups.forEach((fn) => fn());
      row.removeEventListener("pointerleave", leave);
      row.removeEventListener("focusout", focusOut);
      cancelWave();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items.map((i) => i.name).join("|"), initialIndex]);

  return (
    <div
      id="warp-rollover"
      ref={rootRef}
      style={{ margin: "none", width: "100%" }}
    >
      <style>{`
        #warp-rollover .warp-surface{color:#b6c2be;padding:28px 16px 20px;font-family:Arial,sans-serif}
        #warp-rollover .warp-blocks{display:flex;flex-direction:column;margin:auto;max-width:420px;width:100%}
        #warp-rollover button{position:relative;display:flex;align-items:center;width:100%;height:50px;border:0;padding:0;background:transparent;color:#102a5b;cursor:pointer;font:inherit;overflow:hidden}
        #warp-rollover button svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
        #warp-rollover .warp-label{position:relative;z-index:1;padding-left:18px;font-size:12px;letter-spacing:.04em;color:#fdf5e6;opacity:0;transition:opacity .2s ease;pointer-events:none;white-space:nowrap}
        #warp-rollover button[data-active="true"] .warp-label{opacity:1}
        #warp-rollover .warp-caption{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-top:1px solid #102a5b;padding-top:14px;margin-top:8px}
        #warp-rollover .warp-name{font-size:16px;letter-spacing:.04em; color: #202020}
        #warp-rollover .warp-detail{font-size:11px;align-self:center;color:#101010}
      `}</style>
      <div className="warp-surface">
        <div
          className="warp-blocks"
          role="group"
          aria-label="Animated navigation demonstration"
          ref={rowRef}
        >
          {NAMES.map((name, i) => (
            <button
              key={name}
              type="button"
              style={{
                boxShadow: "none",
                outline: "none",
              }}
              aria-label={name + " animation"}
              data-active="false"
              data-selected="false"
              ref={(el) => (blockRefs.current[i] = el)}
            >
              <svg viewBox="0 0 280 72" preserveAspectRatio="none" aria-hidden="true">
                <polygon fill="#040606" />
                <polygon fill="#141a19" stroke="#070a09" strokeWidth=".7" />
                <polygon fill="#42504c" />
              </svg>
              <span className="warp-label">{name}</span>
            </button>
          ))}
        </div>
        <div className="warp-caption">
          <span className="warp-name" ref={nameRef}>
            ACM-OS
          </span>
          <span className="warp-detail" ref={detailRef}>
            INTERACTIVE NAVIGATION
          </span>
        </div>
      </div>
    </div>
  );
}
