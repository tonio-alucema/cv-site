"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Shared card shell ───────────────────────────────────────────────────── */

function Card({
  title,
  tag,
  tagColor = "var(--accent)",
  description,
  annotation,
  onReplay,
  children,
}: {
  title: string;
  tag: string;
  tagColor?: string;
  description: string;
  annotation?: string;
  onReplay?: () => void;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#1a1a1a",
        border: `1px solid ${hovered ? "rgba(234,234,234,0.1)" : "rgba(234,234,234,0.06)"}`,
        borderRadius: 8,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "border-color 0.2s ease",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
            {title}
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10, color: tagColor,
            border: `1px solid ${tagColor}44`, borderRadius: 3,
            padding: "2px 7px", letterSpacing: "0.06em", alignSelf: "flex-start",
          }}>
            {tag}
          </span>
        </div>
        {onReplay && (
          <button
            onClick={onReplay}
            style={{
              fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)",
              border: "1px solid rgba(234,234,234,0.1)", borderRadius: 4,
              padding: "4px 10px", cursor: "pointer", transition: "all 0.15s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "rgba(234,234,234,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.borderColor = "rgba(234,234,234,0.1)"; }}
          >
            replay →
          </button>
        )}
      </div>

      {/* Description */}
      <p style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.65, margin: 0 }}>
        {description}
      </p>

      {/* Live area */}
      <div style={{ flex: 1, minHeight: 72 }}>{children}</div>

      {/* Annotation */}
      {annotation && (
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)",
          background: "rgba(0,0,0,0.3)", borderRadius: 4, padding: "6px 10px",
          lineHeight: 1.5, borderLeft: `2px solid ${tagColor}55`,
        }}>
          <span style={{ color: tagColor, opacity: 0.7 }}>›</span>{" "}
          {annotation}
        </div>
      )}
    </div>
  );
}

/* ─── 1. Spring physics ───────────────────────────────────────────────────── */
function SpringDemo() {
  const [fired, setFired] = useState(false);
  return (
    <Card title="spring physics" tag="FRAMER MOTION" tagColor="var(--accent)"
      description="Click the element — spring overshoot creates organic deceleration. No fixed duration, just stiffness + damping."
      annotation="transition: { type: 'spring', stiffness: 260, damping: 20 }">
      <div
        onClick={() => setFired((f) => !f)}
        style={{
          width: 44, height: 44, borderRadius: 8, background: "var(--accent)", cursor: "pointer",
          transform: fired ? "scale(1.45) rotate(8deg)" : "scale(1)",
          transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />
    </Card>
  );
}

/* ─── 2. Stagger cascade ──────────────────────────────────────────────────── */
function StaggerDemo() {
  const [key, setKey] = useState(0);
  return (
    <Card title="stagger cascade" tag="FRAMER MOTION" tagColor="#a78bfa"
      description="Children animate in sequence with a fixed delay between each. The eye follows the cascade like reading a line."
      annotation="staggerChildren: 0.08, delayChildren: 0.1"
      onReplay={() => setKey((k) => k + 1)}>
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={`${key}-${i}`} style={{
            width: 22, height: 22, borderRadius: 4, background: "#a78bfa",
            opacity: 0, animation: "staggerIn 0.35s ease forwards",
            animationDelay: `${i * 0.08}s`,
          }} />
        ))}
      </div>
      <style>{`@keyframes staggerIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:none } }`}</style>
    </Card>
  );
}

/* ─── 3. Easing curves ────────────────────────────────────────────────────── */
function EasingDemo() {
  const [go, setGo] = useState(false);
  const curves = [
    { name: "ease-out", c: "cubic-bezier(0,0,0.2,1)", color: "var(--accent)" },
    { name: "ease-in-out", c: "cubic-bezier(0.4,0,0.2,1)", color: "#a78bfa" },
    { name: "spring", c: "cubic-bezier(0.34,1.56,0.64,1)", color: "#f59e0b" },
  ];
  return (
    <Card title="easing curves" tag="CSS" tagColor="#f59e0b"
      description="Same distance, same duration, different feel. Easing is the personality of motion."
      annotation="cubic-bezier(0.34, 1.56, 0.64, 1) // spring overshoot">
      <div>
        {curves.map((e) => (
          <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-dim)", width: 70 }}>{e.name}</span>
            <div style={{ flex: 1, height: 1, background: "rgba(234,234,234,0.08)", position: "relative" }}>
              <div style={{
                position: "absolute", left: go ? "calc(100% - 8px)" : 0, top: -4,
                width: 8, height: 8, borderRadius: "50%", background: e.color,
                transition: `left 1s ${e.c}`,
              }} />
            </div>
          </div>
        ))}
        <button
          onClick={() => setGo((g) => !g)}
          style={{
            fontFamily: "var(--font-mono)", fontSize: 10, color: "#f59e0b",
            border: "1px solid rgba(245,158,11,0.3)", borderRadius: 4,
            padding: "4px 10px", cursor: "pointer", marginTop: 4,
          }}
        >
          {go ? "reset" : "compare →"}
        </button>
      </div>
    </Card>
  );
}

/* ─── 4. Scroll trigger ───────────────────────────────────────────────────── */
function ScrollDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const onScroll = useCallback(() => {
    if (!ref.current) return;
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    setPct(Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
  }, []);
  return (
    <Card title="scroll trigger" tag="GSAP" tagColor="#38bdf8"
      description="Scroll position mapped to animation progress. The user controls the pace, not a timer."
      annotation='gsap.to(el, { scrollTrigger: { scrub: true } })'>
      <div>
        <div style={{ height: 3, background: "rgba(234,234,234,0.06)", borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #38bdf8, #a78bfa)", borderRadius: 2, transition: "width 0.1s ease" }} />
        </div>
        <div ref={ref} onScroll={onScroll} style={{
          height: 80, overflowY: "auto", fontFamily: "var(--font-display)", fontSize: 12,
          lineHeight: 1.7, color: "var(--text-dim)", scrollbarWidth: "none",
        }}>
          <p style={{ margin: "0 0 8px" }}>ScrollTrigger maps scroll position to animation progress. Instead of time-based playback, the animation is driven by how far the user has scrolled.</p>
          <p style={{ margin: "0 0 8px" }}>This is the foundation of parallax effects, progress indicators, and scroll-driven storytelling.</p>
          <p style={{ margin: "0 0 8px" }}>In GSAP, you attach a ScrollTrigger to any timeline. The trigger element enters the viewport, and the animation begins.</p>
          <p style={{ margin: 0 }}>The progress bar above is a minimal example: scroll position mapped to width.</p>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", marginTop: 6, display: "block" }}>› scroll · {pct}%</span>
      </div>
    </Card>
  );
}

/* ─── 5. GSAP timeline ────────────────────────────────────────────────────── */
function TimelineDemo() {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "mount", color: "#60a5fa" },
    { label: "fade in", color: "var(--accent)" },
    { label: "slide up", color: "#a78bfa" },
    { label: "done", color: "#f59e0b" },
  ];
  useEffect(() => {
    if (step < steps.length - 1) {
      const t = setTimeout(() => setStep((s) => s + 1), 600);
      return () => clearTimeout(t);
    }
  }, [step]);
  return (
    <Card title="gsap.timeline()" tag="GSAP" tagColor="#f59e0b"
      description="Sequence multiple animations on a shared playhead. Each tween queues after the last."
      annotation='tl.to(el, { opacity: 1 }).to(el, { y: 0 }, "-=0.3")'
      onReplay={() => setStep(0)}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                border: `1px solid ${i <= step ? s.color : "rgba(234,234,234,0.1)"}`,
                background: i < step ? s.color : "transparent",
                transition: "all 0.3s ease",
              }} />
              {i < steps.length - 1 && (
                <div style={{ width: 32, height: 1, background: i < step ? "rgba(234,234,234,0.2)" : "rgba(234,234,234,0.06)", transition: "background 0.3s ease" }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 11, color: steps[step]?.color, transition: "color 0.3s ease" }}>
          → {steps[step]?.label}
        </div>
      </div>
    </Card>
  );
}

/* ─── 6. State machine ────────────────────────────────────────────────────── */
function StateDemo() {
  const [state, setState] = useState<"idle" | "hover" | "active">("idle");
  const cfg = {
    idle:   { bg: "rgba(234,234,234,0.06)", dot: "rgba(234,234,234,0.2)",  label: "IDLE",   labelColor: "var(--text-muted)" },
    hover:  { bg: "rgba(245,158,11,0.12)", dot: "#f59e0b",                 label: "HOVER",  labelColor: "#f59e0b" },
    active: { bg: "rgba(234,234,234,0.9)", dot: "#151515",                  label: "ACTIVE", labelColor: "var(--accent)" },
  };
  const c = cfg[state];
  return (
    <Card title="state machine" tag="RIVE" tagColor="#8b6fd4"
      description="Rive animations respond to internal state logic — each state is a node, transitions are edges."
      annotation='riveInstance.stateMachineInputs("SM")[0].value = true'>
      <div>
        <div
          onMouseEnter={() => setState("hover")}
          onMouseLeave={() => setState("idle")}
          onMouseDown={() => setState("active")}
          onMouseUp={() => setState("hover")}
          style={{
            width: 48, height: 48, borderRadius: 6,
            border: `1px solid ${c.bg}`, background: c.bg, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{
            width: 14, height: 14, background: c.dot,
            borderRadius: 2,
            transform: state === "active" ? "scale(1.5)" : state === "hover" ? "scale(1.15)" : "scale(1)",
            transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          }} />
        </div>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: c.labelColor, marginTop: 8, letterSpacing: "0.1em", transition: "color 0.2s ease" }}>
          STATE: {c.label}
        </p>
      </div>
    </Card>
  );
}

/* ─── 7. Typewriter ───────────────────────────────────────────────────────── */
function TypewriterDemo() {
  const text = "Design is how it works.";
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running || count >= text.length) { if (count >= text.length) setRunning(false); return; }
    const t = setTimeout(() => setCount((c) => c + 1), 50 + Math.random() * 45);
    return () => clearTimeout(t);
  }, [count, running]);
  return (
    <Card title="typewriter" tag="GSAP" tagColor="var(--accent)"
      description="Character-by-character reveal with randomized delay. Feels like a human typing, not a machine."
      annotation='tl.to(chars, { opacity: 1, stagger: { each: 0.04 } })'
      onReplay={() => { setCount(0); setRunning(true); }}>
      <div style={{ minHeight: 28, fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 500, color: "var(--text)", letterSpacing: "-0.01em" }}>
        {text.slice(0, count)}
        <span style={{
          display: "inline-block", width: 7, height: 16, marginLeft: 2,
          background: running ? "var(--accent)" : "rgba(61,255,216,0.5)",
          verticalAlign: "middle",
          animation: running ? "none" : "blink 1.1s step-end infinite",
        }} />
      </div>
    </Card>
  );
}

/* ─── 8. Layout animation ─────────────────────────────────────────────────── */
function LayoutDemo() {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card title="layout animation" tag="FRAMER MOTION" tagColor="#e879a0"
      description="When an element's size or position changes, Motion interpolates between states — no manual keyframes."
      annotation='<motion.div layout transition={{ type: "spring" }} />'>
      <div
        onClick={() => setExpanded((e) => !e)}
        style={{
          width: expanded ? "100%" : 44,
          height: expanded ? 60 : 44,
          borderRadius: expanded ? 8 : 22,
          background: "linear-gradient(135deg, #e879a0, #a78bfa)",
          cursor: "pointer",
          transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <span style={{ fontFamily: "var(--font-display)", fontSize: 11, color: "#fff", opacity: expanded ? 1 : 0, transition: "opacity 0.3s ease 0.1s" }}>
          click to collapse
        </span>
      </div>
    </Card>
  );
}

/* ─── 9. Parallax layers ──────────────────────────────────────────────────── */
function ParallaxDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [mx, setMx] = useState(0);
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMx(((e.clientX - rect.left) / rect.width - 0.5) * 2);
  }, []);
  const layers = [
    { size: 60, color: "rgba(167,139,250,0.15)", speed: 0.05, y: 20 },
    { size: 36, color: "rgba(61,255,216,0.2)",   speed: 0.15, y: 10 },
    { size: 20, color: "rgba(245,158,11,0.35)",   speed: 0.3,  y: 5 },
  ];
  return (
    <Card title="parallax layers" tag="CSS" tagColor="#60a5fa"
      description="Layers move at different speeds relative to input. Deeper layers are slower — creates spatial depth."
      annotation="transform: translateX(mouseX * speed)">
      <div ref={ref} onMouseMove={onMove} style={{
        height: 80, position: "relative", cursor: "crosshair",
        background: "rgba(0,0,0,0.3)", borderRadius: 6, overflow: "hidden",
      }}>
        {layers.map((l, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `calc(50% - ${l.size / 2}px + ${mx * l.speed * 60}px)`,
            top: l.y, width: l.size, height: l.size,
            borderRadius: l.size > 40 ? 8 : l.size > 30 ? 6 : "50%",
            background: l.color,
            transition: "left 0.1s ease",
          }} />
        ))}
        <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          › move mouse ‹
        </div>
      </div>
    </Card>
  );
}

/* ─── 10. Shape morphing ──────────────────────────────────────────────────── */
function MorphDemo() {
  const [shape, setShape] = useState(0);
  const shapes = ["circle", "square", "diamond", "pill"];
  const styles: React.CSSProperties[] = [
    { width: 44, height: 44, borderRadius: "50%" },
    { width: 44, height: 44, borderRadius: 6 },
    { width: 36, height: 36, borderRadius: 4, transform: "rotate(45deg)" },
    { width: 68, height: 28, borderRadius: 14 },
  ];
  return (
    <Card title="shape morphing" tag="CSS / GSAP" tagColor="#38bdf8"
      description="Interpolating border-radius, dimensions, and rotation. CSS handles simple morphs; GSAP MorphSVG for complex paths."
      annotation="gsap.to(el, { morphSVG: targetPath, duration: 0.6 })">
      <div>
        <div
          onClick={() => setShape((s) => (s + 1) % shapes.length)}
          style={{
            ...styles[shape],
            background: "linear-gradient(135deg, #38bdf8, var(--accent))",
            cursor: "pointer",
            transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
        <div style={{ fontFamily: "var(--font-mono)", marginTop: 10, fontSize: 9, color: "#38bdf8" }}>
          {shapes[shape]} · click to morph
        </div>
      </div>
    </Card>
  );
}

/* ─── 11. Sprite sheet ────────────────────────────────────────────────────── */
function SpriteDemo() {
  const [speed, setSpeed] = useState(500);
  const [frame, setFrame] = useState(0);
  const frameCount = 4;

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % frameCount), speed / frameCount);
    return () => clearInterval(id);
  }, [speed]);

  const frames = [
    ["    ╱╲  ╱╲    ", "   ╱  ╲╱  ╲   ", "  │ ●    ● │  ", "  │  ╲──╱  │  ", "   ╲ ╭──╮ ╱   ", "    ╲│▓▓│╱    ", "     │▓▓│     ", "    ╱╰──╯╲    "],
    ["   ─╲    ╱─   ", "    ╲╲  ╱╱    ", "  │ ●    ● │  ", "  │  ╲──╱  │  ", "   ╲ ╭──╮ ╱   ", "    ─│▓▓│─    ", "     │▓▓│     ", "    ╱╰──╯╲    "],
    ["              ", "    ╲    ╱    ", "  ──●    ●──  ", "  │  ╲──╱  │  ", "   ╲ ╭──╮ ╱   ", "    ╲│▓▓│╱    ", "     │▓▓│     ", "    ╱╰──╯╲    "],
    ["   ─╲    ╱─   ", "    ╲╲  ╱╱    ", "  │ ●    ● │  ", "  │  ╲──╱  │  ", "   ╲ ╭──╮ ╱   ", "    ─│▓▓│─    ", "     │▓▓│     ", "    ╱╰──╯╲    "],
  ];

  return (
    <Card title="sprite sheet" tag="CSS / EXPERIMENT" tagColor="#ef4444"
      description="The OG animation technique — step through frames on a strip. Same math as a flipbook: width × frame count = travel distance."
      annotation={`animation: fly ${(speed / 1000).toFixed(1)}s steps(${frameCount}) infinite`}>
      <div>
        <div style={{
          background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)",
          borderRadius: 6, padding: "12px 8px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <pre style={{ fontFamily: "var(--font-mono)", fontSize: 9, lineHeight: 1.35, color: "#ef4444", margin: 0 }}>
            {frames[frame].join("\n")}
          </pre>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", flexShrink: 0 }}>speed</span>
          <input type="range" min={150} max={1200} value={speed} step={50}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#ef4444", height: 3, cursor: "pointer" }}
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#ef4444", minWidth: 36 }}>{(speed / 1000).toFixed(2)}s</span>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          {Array.from({ length: frameCount }).map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: i === frame ? "#ef4444" : "rgba(239,68,68,0.15)", transition: "background 0.1s ease" }} />
          ))}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--text-muted)", marginLeft: 4 }}>frame {frame + 1}/{frameCount}</span>
        </div>
      </div>
    </Card>
  );
}

/* ─── Data Vis gallery (3×6 from tonioalucema.com/Data-Vis) ──────────────── */

const DATA_VIS_ITEMS = [
  { src: "https://freight.cargo.site/t/original/i/ede9fcfc7cb4592d65c9f94f07d89f5e08ae4d47b8b871e41aeded6a905ba302/data-ism_01_r.gif", alt: "data-ism 01" },
  { src: "https://freight.cargo.site/t/original/i/079f3a9d719a9c662a900a16218c2410242fd06b25833e378e4bbf5eae990d42/Comp-9---1080---nodes-2-joined.gif", alt: "Comp 9 nodes joined" },
  { src: "https://freight.cargo.site/t/original/i/9a161452682b772e1d8aea6adaf30a299385a176936873e3a8506669cd87c565/Comp-6A---1080.gif", alt: "Comp 6A" },
  { src: "https://freight.cargo.site/t/original/i/c855fb7e85c9b897e45bc7801e353ec6321a6eebee67546a9621068e0ddd0057/Comp-7---1080---short.gif", alt: "Comp 7 short" },
  { src: "https://freight.cargo.site/t/original/i/e059c4b2a1005815a73375c538be0a31dd4250dadf9f49f433b8a7d60e1e9565/data-ism_17b_r.gif", alt: "data-ism 17b" },
  { src: "https://freight.cargo.site/t/original/i/974b29d9530e45e73467b3ee85dff3e79c5c7912eec27fe23ccb9332f9ffcc49/data-ism_21_r.gif", alt: "data-ism 21" },
  { src: "https://freight.cargo.site/t/original/i/2c3cf6d6d2a095d38da852619050ffcd6b05841a84bd1fe3c3a5d73cd7105fa8/data_ism_19_r.gif", alt: "data-ism 19" },
  { src: "https://freight.cargo.site/t/original/i/0cc63c3463283a45b5ecd70f71d03aa2aaab7de9e4378c49d8ad5517b2d6ef1a/data-ism_15_r_.jpg", alt: "data-ism 15" },
  { src: "https://freight.cargo.site/t/original/i/49bf324f3f3685b9b1cc7ce2fea740aa86c333916aa2fb7b93394540267cd1b3/data-ism_13_r.gif", alt: "data-ism 13" },
  { src: "https://freight.cargo.site/t/original/i/091b31ea8900add869e9ef9e9039b5240b7d64451c3c8e6f1a348fe39553937c/data-ism_18_r.gif", alt: "data-ism 18" },
  { src: "https://freight.cargo.site/t/original/i/83a5f22fd974bb72caec6d5127368b5d91ebfd3f1cedadc927d2ea5ffaa6d204/Comp-3---1080.gif", alt: "Comp 3" },
  { src: "https://freight.cargo.site/t/original/i/132fe3f126878d11ba565b1681c9781f2b28291f7a927e529635ba9166db25b9/data-ism_22b_r_.jpeg", alt: "data-ism 22b" },
  { src: "https://freight.cargo.site/t/original/i/24c39f466cfd0bd50b81669e4278e21cd18ae56441631a43c0d993ba1f9b9171/data-ism_07_r.jpg", alt: "data-ism 07" },
  { src: "https://freight.cargo.site/t/original/i/68cb7a4f2e115814b7748b88b1652d3a26f9c4bdc26a08bfa499e596aba28a4a/data-ism_08_r.jpg", alt: "data-ism 08" },
  { src: "https://freight.cargo.site/t/original/i/c13796c5e075d6d988231ea2a107cb4759bad4001ae7f078d89adeaa46a5a85a/1080x1080_stage.gif", alt: "1080 stage" },
  { src: "https://freight.cargo.site/t/original/i/e1f0921e2a94fa1f23c2c056e9fd3ad469e2e56987c811cb0a8b7e5be6deb72d/tao.png", alt: "tao" },
  { src: "https://freight.cargo.site/t/original/i/f27f74807c43ebdd9b4061169194d122251b66c44c4efa8ef9e26a3c87881e04/data-ism_14_r_.jpg", alt: "data-ism 14" },
  { src: "https://freight.cargo.site/t/original/i/7c80a892b7aab3531c75e78dab1f37ca6695dbf910c135608db27272e0599fc9/Screen-Shot-2017-06-08-at-12.32.50-AM.png", alt: "Screen shot 2017" },
] as const;

function DataVisGallery() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
        marginBottom: 64,
      }}
    >
      {DATA_VIS_ITEMS.map((item) => (
        <div
          key={item.src}
          style={{
            aspectRatio: "1 / 1",
            overflow: "hidden",
            borderRadius: 4,
            background: "#111",
          }}
        >
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ))}
    </div>
  );
}

const SANDBOX_VIMEO_ITEMS = [
  {
    videoId: "1200182948",
    title: "Form_v01_sm",
    description: "Circular experimentation for Bang & Olufsen. (circa 2013)",
  },
  {
    videoId: "31803727",
    title: "2011 Summer Reel",
    description: "Personal motion reel. (circa 2011)",
    width: 720,
    height: 408,
  },
  {
    videoId: "29306139",
    title: "History Channel - Pearl Harbor",
    description: "Pearl Harbor teaser... purely experimental – playing with after effects layering/editing (circa 2011)",
    width: 720,
    height: 408,
  },
  {
    videoId: "4597110",
    title: "Grafic Park Reel '09",
    description: "Grafic Park studio reel. (circa 2009)",
    width: 720,
    height: 408,
  },
] as const;

function SandboxVimeoEmbed({
  videoId,
  title,
  description,
  width,
  height,
}: {
  videoId: string;
  title: string;
  description: string;
  width?: number;
  height?: number;
}) {
  const fixedSize = width != null && height != null;

  return (
    <div
      style={{
        marginBottom: 64,
        width: fixedSize ? "fit-content" : undefined,
        maxWidth: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: fixedSize ? width : "100%",
          maxWidth: "100%",
          aspectRatio: fixedSize ? `${width} / ${height}` : "16 / 9",
          borderRadius: 12,
          overflow: "hidden",
          background: "#111",
        }}
      >
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      </div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 13,
          color: "var(--text-dim)",
          lineHeight: 1.65,
          margin: "12px 0 0",
          maxWidth: fixedSize ? width : 560,
        }}
      >
        {description}
      </p>
    </div>
  );
}

function SandboxVimeoEmbeds() {
  return (
    <>
      {SANDBOX_VIMEO_ITEMS.map((item) => (
        <SandboxVimeoEmbed key={item.videoId} {...item} />
      ))}
    </>
  );
}

/** Set to true to show the interactive motion technique cards below the Data Vis gallery. */
const SHOW_MOTION_DEMOS = false;

/* ─── Sandbox shell ───────────────────────────────────────────────────────── */

export function Sandbox() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em", margin: "0 0 12px" }}>
            Sandbox
          </h2>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--text-dim)", lineHeight: 1.65, maxWidth: 480, margin: 0 }}>
            Visual and motion explorations... some might be parts of a project but most are purely experimental.
          </p>
        </div>
      </div>

      {/* Data Vis gallery */}
      <DataVisGallery />

      {/* Vimeo embeds */}
      <SandboxVimeoEmbeds />

      {/* Motion demo grid */}
      {SHOW_MOTION_DEMOS ? (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 12,
      }}>
        <SpringDemo />
        <StaggerDemo />
        <EasingDemo />
        <ScrollDemo />
        <TimelineDemo />
        <StateDemo />
        <TypewriterDemo />
        <LayoutDemo />
        <ParallaxDemo />
        <MorphDemo />
        <SpriteDemo />
      </div>
      ) : null}
    </div>
  );
}
