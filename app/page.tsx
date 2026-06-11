"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ARCH_MD, HERO, ROLES, SOUL_MD, type Role, type SoulMdContent } from "./data";
import { Visual, WideVisualPlaceholder } from "./Visual";
import { Sandbox } from "./Sandbox";

const NAV_HEIGHT = 50;

/** Timeline right rail — media scrolls underneath while sticky copy stays fixed until the next project. */
const TIMELINE_ASIDE_WIDTH = 308;
const TIMELINE_COL_GAP = 32;
const STICKY_TEXT_TOP = NAV_HEIGHT + 32;
/** Aside width + column gap: media is this much wider than the first grid track so it tucks under the sticky column. */
const TIMELINE_UNDERLAP_X = TIMELINE_ASIDE_WIDTH + TIMELINE_COL_GAP;

/** Hero credibility strip — order/spacing aligned with Figma logo group (569:2602). */
const HERO_LOGO_ITEMS = [
  { src: "/logos/logo-square.svg", alt: "Square" },
  { src: "/logos/logo-cambly.svg", alt: "Cambly" },
  { src: "/logos/logo-cash.svg", alt: "Cash App" },
  { src: "/logos/logo-meta.svg", alt: "Meta" },
  { src: "/logos/logo-pinterest.svg", alt: "Pinterest" },
  { src: "/logos/logo-apple.svg", alt: "Apple" },
  { src: "/logos/logo-beats.svg", alt: "Beats" },
  { src: "/logos/logo-microsoft.svg", alt: "Microsoft" },
] as const;

const HERO_LOGO_STRIP_CONTAINER_VARIANTS = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.052,
      delayChildren: 0.1,
    },
  },
};

const HERO_LOGO_STRIP_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 130,
      damping: 12,
      mass: 0.9,
    },
  },
};

/** Drag playground: ±200px vertical, ±viewport/2 horizontal. Elastic past edges. */
const HERO_LOGO_DRAG_Y = 200;
const HERO_LOGO_DRAG_ELASTIC = 0.5;
/** Exponential falloff so a logo `n` steps away follows ~e^(-0.7·n) of the drag offset. */
const HERO_LOGO_FOLLOW_DECAY = 0.7;
/** Closer logos snap quicker; farther ones lag — the difference *is* the chain stagger. */
const HERO_LOGO_FOLLOW_STIFF_BASE = 380;
const HERO_LOGO_FOLLOW_STIFF_STEP = 45;
const HERO_LOGO_FOLLOW_STIFF_MIN = 180;
const HERO_LOGO_FOLLOW_DAMPING = 26;
const HERO_LOGO_FOLLOW_MASS = 0.7;

/** Hero + SOUL_MD preface — collapses when switching to sandbox tab. */
const TIMELINE_PRELUDE_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
/** Same curve as TIMELINE_PRELUDE_EASE — tuple form for Framer Motion `transition.ease`. */
const TIMELINE_PRELUDE_EASE_BEZIER = [0.4, 0, 0.2, 1] as const;
const TIMELINE_PRELUDE_MS = 0.45;

/** soul.md 3-column fade: successive columns start halfway through the prior column’s fade (50% overlap). */
const SOUL_COL_FADE_S = TIMELINE_PRELUDE_MS * 0.85;
const SOUL_COL_STAGGER_S = SOUL_COL_FADE_S * 0.5;

export default function Page() {
  const [tab, setTab] = useState<"timeline" | "sandbox">("timeline");
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    const i = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(i);
  }, []);

  // scroll to top on tab switch
  useEffect(() => { window.scrollTo({ top: 0 }); }, [tab]);

  return (
    <main style={{ minHeight: "100vh", overflowX: "clip", background: "var(--bg)", color: "var(--text)", paddingBottom: 120 }}>
      <Nav tab={tab} onTab={setTab} cursorOn={cursorOn} />

      <div style={containerStyle}>
        <div
          aria-hidden={tab === "sandbox"}
          style={{
            display: "grid",
            gridTemplateRows: tab === "timeline" ? "1fr" : "0fr",
            opacity: tab === "timeline" ? 1 : 0,
            pointerEvents: tab === "timeline" ? "auto" : "none",
            transition: [
              `grid-template-rows ${TIMELINE_PRELUDE_MS}s ${TIMELINE_PRELUDE_EASE}`,
              `opacity ${TIMELINE_PRELUDE_MS * 0.85}s ease`,
            ].join(", "),
          }}
        >
          <div style={{ overflow: "hidden", minHeight: 0 }}>
            <div
              style={{
                transform: tab === "timeline" ? "translateY(0)" : "translateY(-14px)",
                transition: `transform ${TIMELINE_PRELUDE_MS}s ${TIMELINE_PRELUDE_EASE}`,
              }}
            >
              {/* Hero */}
              <section style={{ paddingTop: 80, paddingBottom: 60 }}>
                <h1
                  style={{
                    margin: 0,
                    maxWidth: 1072,
                    width: "100%",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 56,
                    lineHeight: "64px",
                    letterSpacing: "-0.03em",
                    color: "var(--text)",
                  }}
                >
                  {HERO.headline}
                </h1>
                <HeroLogoStrip />
              </section>

              <SoulMdSection />
            </div>
          </div>
        </div>

        {/* Content */}
        <section
          key={tab}
          style={{
            animation: `${tab === "sandbox" ? "sandboxFadeUp" : "fadeUp"} 0.35s ease both`,
            paddingTop: tab === "sandbox" ? 32 : 0,
          }}
        >
          {tab === "timeline" ? (
            ROLES.map((r, i) => <RoleRow key={`${r.year}-${r.company}`} role={r} index={i} />)
          ) : (
            <Sandbox />
          )}
        </section>
      </div>
    </main>
  );
}

function HeroLogoListItem({
  item,
  animated,
}: {
  item: (typeof HERO_LOGO_ITEMS)[number];
  animated: boolean;
}) {
  const shellStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    flexShrink: 0,
  };
  const img = (
    <img
      src={item.src}
      alt={item.alt}
      style={{
        height: 44,
        width: "auto",
        maxWidth: 60,
        objectFit: "contain",
        display: "block",
      }}
    />
  );
  if (animated) {
    return (
      <motion.div
        role="listitem"
        variants={HERO_LOGO_STRIP_ITEM_VARIANTS}
        style={shellStyle}
      >
        {img}
      </motion.div>
    );
  }
  return (
    <div role="listitem" style={shellStyle}>
      {img}
    </div>
  );
}

/** Logo row under headline — matches Figma strip (~44px cap height, 17px gap). */
function HeroLogoStrip() {
  const reduceMotion = useReducedMotion();
  /** Only flips on drag start / end — never per-frame, so the strip never re-renders mid-drag. */
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [viewportW, setViewportW] = useState(1200);

  /** Live drag offset of the active logo — updated outside React via motion values. */
  const sharedX = useMotionValue(0);
  const sharedY = useMotionValue(0);

  useEffect(() => {
    const update = () => setViewportW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const listStyle: CSSProperties = {
    marginTop: 24,
    maxWidth: 1072,
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    gap: 17,
    alignItems: "center",
  };

  if (reduceMotion) {
    return (
      <div role="list" aria-label="Selected workplaces" style={listStyle}>
        {HERO_LOGO_ITEMS.map((item) => (
          <HeroLogoListItem key={item.src} item={item} animated={false} />
        ))}
      </div>
    );
  }

  const dragConstraints = {
    top: -HERO_LOGO_DRAG_Y,
    bottom: HERO_LOGO_DRAG_Y,
    left: -viewportW / 2,
    right: viewportW / 2,
  };

  return (
    <motion.div
      role="list"
      aria-label="Selected workplaces"
      style={listStyle}
      initial="hidden"
      animate="visible"
      variants={HERO_LOGO_STRIP_CONTAINER_VARIANTS}
    >
      {HERO_LOGO_ITEMS.map((item, i) => (
        <HeroLogoDraggable
          key={item.src}
          item={item}
          index={i}
          activeIdx={activeIdx}
          sharedX={sharedX}
          sharedY={sharedY}
          constraints={dragConstraints}
          onDragStart={() => setActiveIdx(i)}
          onDragEnd={() => {
            setActiveIdx(null);
            sharedX.set(0);
            sharedY.set(0);
          }}
        />
      ))}
    </motion.div>
  );
}

/**
 * One logo: outer keeps the entrance variants; inner is the drag surface.
 * Position is always driven by `ownX`/`ownY` so drag and follow share a single
 * source of truth — no `animate` prop, no per-frame React renders, no jumps.
 */
function HeroLogoDraggable({
  item,
  index,
  activeIdx,
  sharedX,
  sharedY,
  constraints,
  onDragStart,
  onDragEnd,
}: {
  item: (typeof HERO_LOGO_ITEMS)[number];
  index: number;
  activeIdx: number | null;
  sharedX: MotionValue<number>;
  sharedY: MotionValue<number>;
  constraints: { top: number; bottom: number; left: number; right: number };
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const isActive = activeIdx === index;
  const distance = activeIdx == null ? null : Math.abs(index - activeIdx);
  const falloff =
    isActive || distance == null ? 0 : Math.exp(-distance * HERO_LOGO_FOLLOW_DECAY);

  /** Stiffness drops with distance → closer neighbors race ahead, far ones trail. */
  const followSpringCfg = useMemo(
    () => ({
      stiffness: Math.max(
        HERO_LOGO_FOLLOW_STIFF_MIN,
        HERO_LOGO_FOLLOW_STIFF_BASE - (distance ?? 0) * HERO_LOGO_FOLLOW_STIFF_STEP,
      ),
      damping: HERO_LOGO_FOLLOW_DAMPING,
      mass: HERO_LOGO_FOLLOW_MASS,
    }),
    [distance],
  );

  /** Single position source. Drag writes to it while active; the subscription below writes to it otherwise. */
  const ownX = useMotionValue(0);
  const ownY = useMotionValue(0);

  const followX = useTransform(sharedX, (v) => v * falloff);
  const followY = useTransform(sharedY, (v) => v * falloff);
  const followSpringX = useSpring(followX, followSpringCfg);
  const followSpringY = useSpring(followY, followSpringCfg);

  useEffect(() => {
    if (isActive) return;
    const unsubX = followSpringX.on("change", (v) => ownX.set(v));
    const unsubY = followSpringY.on("change", (v) => ownY.set(v));
    return () => {
      unsubX();
      unsubY();
    };
  }, [isActive, followSpringX, followSpringY, ownX, ownY]);

  const shellStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    flexShrink: 0,
  };

  return (
    <motion.div role="listitem" variants={HERO_LOGO_STRIP_ITEM_VARIANTS} style={shellStyle}>
      <motion.div
        drag
        dragConstraints={constraints}
        dragElastic={HERO_LOGO_DRAG_ELASTIC}
        dragSnapToOrigin
        dragTransition={{
          bounceStiffness: HERO_LOGO_FOLLOW_STIFF_BASE,
          bounceDamping: HERO_LOGO_FOLLOW_DAMPING,
        }}
        onDragStart={onDragStart}
        onDrag={(_, info) => {
          sharedX.set(info.offset.x);
          sharedY.set(info.offset.y);
        }}
        onDragEnd={onDragEnd}
        whileDrag={{ cursor: "grabbing", zIndex: 1 }}
        style={{
          x: ownX,
          y: ownY,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "grab",
          touchAction: "none",
        }}
      >
        <img
          src={item.src}
          alt={item.alt}
          draggable={false}
          style={{
            height: 44,
            width: "auto",
            maxWidth: 60,
            objectFit: "contain",
            display: "block",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/** Display body copy shared across SoulMdSection columns (headings keep mono styles separately). */
const SOUL_SECTION_BODY_COPY: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: 14,
  fontWeight: 400,
  lineHeight: "20px",
  letterSpacing: "0px",
};

/** Tools + milestones columns: tighter row rhythm (−25% vs SOUL_SECTION_BODY_COPY). */
const SOUL_MD_LIST_BODY: CSSProperties = {
  ...SOUL_SECTION_BODY_COPY,
  lineHeight: "15px",
};
const SOUL_MD_LIST_ITEM_GAP_PX = 10.5;

/** Mono column titles starting with ↓ / ↑ / # — leading glyph uses accent turquoise. */
function SoulMdLeadingArrowTitle({ title }: { title: string }) {
  const m = title.match(/^([↓↑#])\s*(.*)$/u);
  if (!m) return title;
  const [, glyph, rest] = m;
  return (
    <>
      <span style={{ color: "var(--accent)" }}>{glyph}</span>
      {rest.length ? ` ${rest}` : null}
    </>
  );
}

/** Mono line: `[→]` (arrow rotates when expanded) + filename — no frame. */
function SoulMdToggleAsciiFrame({ fileLabel }: { fileLabel: string }) {
  const row: CSSProperties = {
    display: "block",
    whiteSpace: "pre",
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
  };

  return (
    <span style={row}>
      <span className="soul-md-toggle-accent" aria-hidden>
        {"["}
      </span>
      <span className="soul-md-toggle-accent soul-md-toggle-arrow" aria-hidden>
        →
      </span>
      <span className="soul-md-toggle-accent" aria-hidden>
        {"]"}
      </span>
      {" "}
      <span className="soul-md-toggle-accent">{fileLabel}</span>
    </span>
  );
}

const SOUL_MD_MONO_HEAD = {
  fontFamily: "var(--font-mono)",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "20px",
  marginBottom: 20,
} as const;

/** Arc panel SVGs at 1:1 export size; adjacent images overlap horizontally by 2px. */
const ARC_SVG_ASSETS = [
  { file: "arc 1.svg", w: 200, h: 139 },
  { file: "arc 2.svg", w: 225, h: 139 },
  { file: "arc 3.svg", w: 265, h: 139 },
  { file: "arc 4.svg", w: 387, h: 139 },
] as const;
const ARC_OVERLAP_PX = 2;
const ARC_ROW_WIDTH_PX =
  ARC_SVG_ASSETS.reduce((sum, a) => sum + a.w, 0) -
  (ARC_SVG_ASSETS.length - 1) * ARC_OVERLAP_PX;
const ARC_CASCADE_OFFSET_PX = 24;
/** Matches main column inner width (container maxWidth 1120 − horizontal padding). */
const ARC_CONTENT_MAX_PX = 1072;
/** Trailing heart on arc blurb — rendered upright while the rest stays italic. */
const ARC_BLURB_HEART_SUFFIX = " ♥";

/** Stagger: each step starts at 30% of the prior item’s duration (70% overlap). Total ~1s to final settle. Step count = SVGs plus optional blurb. */
const ARC_DIAG_TOTAL_S = 1;
const ARC_DIAG_OVERLAP = 0.7;
const ARC_DIAG_SLIDE_PX = 18;
const ARC_DIAG_EASE = [0.36, 0, 0.26, 1.52] as const;

/** Career arc: exported SVGs in a stepped layout. */
function ArcFigmaDiagram({
  animateIn,
  blurb,
}: {
  animateIn: boolean;
  blurb?: string;
}) {
  const reduceMotion = useReducedMotion();

  const svgCount = ARC_SVG_ASSETS.length;
  const arcStepCount = blurb ? svgCount + 1 : svgCount;
  const itemDuration = reduceMotion
    ? 0
    : ARC_DIAG_TOTAL_S /
      (1 + (1 - ARC_DIAG_OVERLAP) * Math.max(0, arcStepCount - 1));
  const stagger = reduceMotion ? 0 : (1 - ARC_DIAG_OVERLAP) * itemDuration;
  const exitDuration = reduceMotion ? 0 : TIMELINE_PRELUDE_MS;

  return (
    <section
      aria-label="Career arc diagram"
      style={{
        width: "100%",
        maxWidth: ARC_CONTENT_MAX_PX,
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <p style={{ ...SOUL_MD_MONO_HEAD, color: "var(--text)" }}>
        <SoulMdLeadingArrowTitle title="# tonio's arc" />
      </p>
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 0,
            width: ARC_ROW_WIDTH_PX,
            minWidth: ARC_ROW_WIDTH_PX,
            paddingBottom: 0,
          }}
        >
          {ARC_SVG_ASSETS.map(({ file, w, h }, i) => (
            <motion.img
              key={file}
              src={`/arc/${encodeURIComponent(file)}`}
              alt=""
              width={w}
              height={h}
              initial={false}
              animate={
                animateIn
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: -ARC_DIAG_SLIDE_PX }
              }
              transition={
                animateIn
                  ? {
                      delay: i * stagger,
                      duration: itemDuration,
                      ease: ARC_DIAG_EASE,
                    }
                  : {
                      duration: exitDuration,
                      ease: TIMELINE_PRELUDE_EASE_BEZIER,
                    }
              }
              style={{
                display: "block",
                flexShrink: 0,
                marginLeft: i === 0 ? 0 : -ARC_OVERLAP_PX,
                marginTop: i * ARC_CASCADE_OFFSET_PX,
              }}
            />
          ))}
        </div>
      </div>
      {blurb ? (
        <motion.p
          initial={false}
          animate={animateIn ? { opacity: 1 } : { opacity: 0 }}
          transition={
            animateIn
              ? {
                  delay: svgCount * stagger,
                  duration: itemDuration,
                  ease: "easeOut",
                }
              : {
                  duration: exitDuration,
                  ease: TIMELINE_PRELUDE_EASE_BEZIER,
                }
          }
          style={{
            fontFamily: '"Code Saver"',
            fontSize: 12,
            fontWeight: 500,
            fontStyle: "italic",
            lineHeight: "20px",
            letterSpacing: "0px",
            marginTop: 20,
            marginBottom: 40,
            marginLeft: 0,
            paddingLeft: 120,
            paddingRight: 120,
            color: "var(--text-dim)",
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            textAlign: "center",
          }}
        >
          {blurb.endsWith(ARC_BLURB_HEART_SUFFIX) ? (
            <>
              {blurb.slice(0, -ARC_BLURB_HEART_SUFFIX.length)}
              <span style={{ fontStyle: "normal" }}>{ARC_BLURB_HEART_SUFFIX}</span>
            </>
          ) : (
            blurb
          )}
        </motion.p>
      ) : null}
    </section>
  );
}

function SoulMdPanelGrid({
  md,
  panelOpen,
}: {
  md: SoulMdContent;
  panelOpen: boolean;
}) {
  const reduceMotion = useReducedMotion();

  if (md.diagramOnly) {
    return <ArcFigmaDiagram animateIn={panelOpen} blurb={md.arcBlurb} />;
  }

  const colCount = 3;
  const colFadeDuration = reduceMotion ? 0 : SOUL_COL_FADE_S;
  const colStagger = reduceMotion ? 0 : SOUL_COL_STAGGER_S;
  const colEase = [0.4, 0, 0.2, 1] as const;

  const colTransition = (colIndex: number) => ({
    duration: colFadeDuration,
    delay:
      panelOpen ? colIndex * colStagger : (colCount - 1 - colIndex) * colStagger,
    ease: colEase,
  });

  const monoHead = SOUL_MD_MONO_HEAD;
  return (
    <div>
      {md.asciiDiagram ? (
        <section
          aria-label="Career arc diagram"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: 48,
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 400,
              lineHeight: 1.45,
              letterSpacing: 0,
              color: "var(--text)",
              whiteSpace: "pre",
              textAlign: "left",
              overflowX: "auto",
              maxWidth: "100%",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {md.asciiDiagram}
          </pre>
        </section>
      ) : null}
      <div
        style={{
          display: "flex",
          gap: 32,
          alignItems: "flex-start",
          flexWrap: "wrap",
          paddingBottom: 20,
        }}
      >
      <motion.div
        initial={false}
        animate={panelOpen ? { opacity: 1 } : { opacity: 0 }}
        transition={colTransition(0)}
        style={{ flex: "1 1 200px", minWidth: 0, color: "var(--text)" }}
      >
        <p style={{ ...monoHead, color: "var(--text)" }}>
          <SoulMdLeadingArrowTitle title={md.pointOfView.title} />
        </p>
        <p style={{ ...SOUL_SECTION_BODY_COPY, margin: 0 }}>{md.pointOfView.body}</p>
      </motion.div>

      <motion.div
        initial={false}
        animate={panelOpen ? { opacity: 1 } : { opacity: 0 }}
        transition={colTransition(1)}
        style={{
          flex: "1 1 200px",
          minWidth: 0,
          paddingLeft: 48,
          color: "#f9f9f9",
          fontSize: 14,
          lineHeight: "20px",
        }}
      >
        <p style={{ ...monoHead, color: "#f9f9f9", letterSpacing: "0.32px" }}>
          <SoulMdLeadingArrowTitle title={md.tools.title} />
        </p>
        {md.tools.list.map((line, i) => (
          <p
            key={line}
            style={{
              ...SOUL_MD_LIST_BODY,
              margin: 0,
              marginBottom:
                i < md.tools.list.length - 1
                  ? SOUL_MD_LIST_ITEM_GAP_PX
                  : md.tools.notes.length > 0
                    ? SOUL_MD_LIST_ITEM_GAP_PX
                    : 0,
            }}
          >
            • {line}
          </p>
        ))}
        {md.tools.notes.map((line, i) => (
          <p
            key={line}
            style={{
              ...SOUL_MD_LIST_BODY,
              margin: 0,
              marginBottom:
                i < md.tools.notes.length - 1 ? SOUL_MD_LIST_ITEM_GAP_PX : 0,
            }}
          >
            <span style={{ color: "var(--accent)" }}>*</span> {line}
          </p>
        ))}
      </motion.div>

      <motion.div
        initial={false}
        animate={panelOpen ? { opacity: 1 } : { opacity: 0 }}
        transition={colTransition(2)}
        style={{
          width: 308,
          flexShrink: 0,
          color: "#f9f9f9",
          fontSize: 14,
          lineHeight: "20px",
        }}
      >
        <p style={{ ...monoHead, color: "#f9f9f9" }}>
          <SoulMdLeadingArrowTitle title={md.achievements.title} />
        </p>
        {md.achievements.items.map((line, i) => (
          <p
            key={line}
            style={{
              ...SOUL_MD_LIST_BODY,
              margin: 0,
              marginBottom:
                i < md.achievements.items.length - 1
                  ? SOUL_MD_LIST_ITEM_GAP_PX
                  : 0,
            }}
          >
            {line}
          </p>
        ))}
      </motion.div>
    </div>
    </div>
  );
}

function SoulMdDocToggle({
  toggleId,
  panelId,
  fileLabel,
  open,
  setOpen,
  ariaAboutLabel,
}: {
  toggleId: string;
  panelId: string;
  fileLabel: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  ariaAboutLabel: string;
}) {
  return (
    <button
      type="button"
      id={toggleId}
      aria-expanded={open}
      aria-controls={panelId}
      aria-label={`${open ? "Collapse" : "Expand"} About ${ariaAboutLabel}`}
      onClick={() => setOpen((o) => !o)}
      className="soul-md-toggle-btn"
      style={{
        display: "block",
        flexShrink: 0,
        marginBottom: 0,
        padding: 0,
        textAlign: "left",
        width: "fit-content",
        maxWidth: "100%",
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: 14,
        fontWeight: 400,
        lineHeight: "16px",
        letterSpacing: 0,
        whiteSpace: "pre",
        color: "var(--text)",
        background: "none",
        border: "none",
        userSelect: "none",
      }}
    >
      <SoulMdToggleAsciiFrame fileLabel={fileLabel} />
    </button>
  );
}

function SoulMdDocPanel({
  panelId,
  toggleId,
  open,
  md,
  preludeDurationS = TIMELINE_PRELUDE_MS,
}: {
  panelId: string;
  toggleId: string;
  open: boolean;
  md: SoulMdContent;
  /** Grid + slide timing (and fade-out duration when collapsed). */
  preludeDurationS?: number;
}) {
  /** Fade opacity only while collapsing so content eases out; omit on open so soul columns / arc diagram aren’t double-faded. */
  const panelTransition = open
    ? `grid-template-rows ${preludeDurationS}s ${TIMELINE_PRELUDE_EASE}`
    : [
        `grid-template-rows ${preludeDurationS}s ${TIMELINE_PRELUDE_EASE}`,
        `opacity ${preludeDurationS}s ${TIMELINE_PRELUDE_EASE}`,
      ].join(", ");

  return (
    <div
      id={panelId}
      role="region"
      aria-labelledby={toggleId}
      aria-hidden={!open}
      style={{
        display: "grid",
        gridTemplateRows: open ? "1fr" : "0fr",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: panelTransition,
      }}
    >
      <div style={{ overflow: "hidden", minHeight: 0 }}>
        <div
          style={{
            transform: open ? "translateY(0)" : "translateY(-14px)",
            transition: `transform ${preludeDurationS}s ${TIMELINE_PRELUDE_EASE}`,
          }}
        >
          <SoulMdPanelGrid md={md} panelOpen={open} />
        </div>
      </div>
    </div>
  );
}

function SoulMdSection() {
  const [soulMdOpen, setSoulMdOpen] = useState(false);
  const [archMdOpen, setArchMdOpen] = useState(false);
  const soulFile = HERO.links.soul ?? "soul.md";
  const docNavOpen = soulMdOpen || archMdOpen;

  return (
    <section
      style={{
        paddingBottom: 60,
        transition: `padding-bottom ${TIMELINE_PRELUDE_MS}s ${TIMELINE_PRELUDE_EASE}`,
      }}
    >
      <nav
        aria-label="About documents"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 28,
          alignItems: "flex-end",
          paddingBottom: 14,
          marginBottom: docNavOpen ? 28 : 14,
          transition: `margin-bottom ${TIMELINE_PRELUDE_MS}s ${TIMELINE_PRELUDE_EASE}`,
        }}
      >
        <SoulMdDocToggle
          toggleId="soul-md-toggle"
          panelId="soul-md-panel"
          fileLabel="soul.md"
          ariaAboutLabel={soulFile}
          open={soulMdOpen}
          setOpen={setSoulMdOpen}
        />
        <SoulMdDocToggle
          toggleId="arch-md-toggle"
          panelId="arch-md-panel"
          fileLabel="arc.md"
          ariaAboutLabel="arc.md"
          open={archMdOpen}
          setOpen={setArchMdOpen}
        />
      </nav>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <SoulMdDocPanel
          panelId="soul-md-panel"
          toggleId="soul-md-toggle"
          open={soulMdOpen}
          md={SOUL_MD}
        />
        <SoulMdDocPanel
          panelId="arch-md-panel"
          toggleId="arch-md-toggle"
          open={archMdOpen}
          md={ARCH_MD}
        />
      </div>
    </section>
  );
}

/* ─── Nav ─────────────────────────────────────────────────────────────────── */

const NAV_NAME_TYPED = HERO.name.toLowerCase();
const NAV_CURSOR_BOX: CSSProperties = {
  display: "inline-block",
  width: 7,
  height: 14,
  background: "var(--accent)",
  marginLeft: 2,
  verticalAlign: "middle",
};

type NavIntroPhase = "name" | "timeline" | "done";

function NavExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="nav-external-link">
      <span className="nav-external-link-label">{label}</span>
      <span className="nav-external-link-arrow"> ↗</span>
    </a>
  );
}

function Nav({
  tab,
  onTab,
  cursorOn,
}: {
  tab: "timeline" | "sandbox";
  onTab: (t: "timeline" | "sandbox") => void;
  cursorOn: boolean;
}) {
  const [introPhase, setIntroPhase] = useState<NavIntroPhase>("name");
  const [nameIdx, setNameIdx] = useState(0);

  useEffect(() => {
    if (introPhase !== "name") return;
    if (nameIdx >= NAV_NAME_TYPED.length) {
      setIntroPhase("timeline");
      return;
    }
    const t = setTimeout(() => setNameIdx((c) => c + 1), 55 + Math.random() * 50);
    return () => clearTimeout(t);
  }, [introPhase, nameIdx]);

  useEffect(() => {
    if (introPhase !== "timeline") return;
    const t = setTimeout(() => setIntroPhase("done"), 720);
    return () => clearTimeout(t);
  }, [introPhase]);

  const introActive = introPhase !== "done";
  const tabsDimmed = introPhase === "name";
  const timelineSpotlight = introPhase === "timeline" || (introPhase === "done" && tab === "timeline");

  const settleTab = (t: "timeline" | "sandbox") => {
    if (introActive) setIntroPhase("done");
    onTab(t);
  };

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50, height: NAV_HEIGHT,
      background: "rgba(21, 21, 21, 0.86)", backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    }}>
      <div style={{ ...containerStyle, display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center" }}>
            <span style={{ color: "var(--text-dim)", marginRight: 8 }}>~/cv</span>
            <span style={{ color: "var(--text-muted)" }}> </span>
            {/* Invisible measure: full name + cursor so tab column stays fixed while typing */}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                aria-hidden
                style={{
                  visibility: "hidden",
                  display: "inline-flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {NAV_NAME_TYPED}
                <span style={{ ...NAV_CURSOR_BOX, visibility: "hidden" }} />
              </span>
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "var(--text)" }}>
                  {introPhase === "name" ? NAV_NAME_TYPED.slice(0, nameIdx) : NAV_NAME_TYPED}
                </span>
                {introPhase === "name" && nameIdx < NAV_NAME_TYPED.length && (
                  <span
                    style={{
                      ...NAV_CURSOR_BOX,
                      background: cursorOn ? "var(--accent)" : "transparent",
                    }}
                  />
                )}
              </span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {(["timeline", "sandbox"] as const).map((t) => {
              const showBar = t === "timeline" ? timelineSpotlight : tab === t;
              /** Same blink as the typing cursor when this tab is active; solid accent for spotlight-without-focus edge cases. */
              const barBlink = tab === t && showBar;

              return (
                <button
                  key={t}
                  onClick={() => settleTab(t)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    fontFamily: '"Code Saver"', fontSize: 14, fontWeight: 500,
                    color: "var(--text)",
                    opacity: tabsDimmed ? 0.4 : t === tab ? 1 : 0.4,
                    cursor: "pointer", transition: "opacity 0.2s ease",
                    padding: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (tabsDimmed) return;
                    if (tab !== t) e.currentTarget.style.opacity = "0.7";
                  }}
                  onMouseLeave={(e) => {
                    if (tabsDimmed) return;
                    if (tab !== t) e.currentTarget.style.opacity = "0.4";
                  }}
                >
                  {t}
                  {/* Fixed-width slot so timeline bar toggling doesn’t shift sibling tabs during intro */}
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 14,
                      flexShrink: 0,
                      background: showBar
                        ? barBlink
                          ? cursorOn
                            ? "var(--accent)"
                            : "transparent"
                          : "var(--accent)"
                        : "transparent",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <nav
          className="site-nav"
          data-intro-active={introActive ? "" : undefined}
          style={{
          display: "flex", alignItems: "center", gap: 24,
          fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 500,
        }}
        >
          {/* Hidden for now: ~/nav soul.md label was <span>soul.md #</span> */}
          <NavExternalLink href={`mailto:${HERO.email}`} label="email" />
          <NavExternalLink href={HERO.links.twitter} label="x/twitter" />
          <NavExternalLink href={HERO.links.github} label="github" />
        </nav>
      </div>
    </header>
  );
}

/* ─── Timeline row ────────────────────────────────────────────────────────── */

/** Section bodies in data are stored as " – …" (label is authored separately). */
function sectionBodyWithoutLabelPrefix(body: string) {
  return body.replace(/^\s*[\u2013\u2014-]\s*/, "").trimStart();
}

function RoleRow({ role, index }: { role: Role; index: number }) {
  return (
    <div style={{ marginBottom: 130, animation: `fadeUp 0.5s ${0.05 * index}s both ease` }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `minmax(0, 1fr) ${TIMELINE_ASIDE_WIDTH}px`,
          columnGap: TIMELINE_COL_GAP,
          alignItems: "start",
        }}
      >
        <div
          style={{
            minWidth: 0,
            width: `calc(100% + ${TIMELINE_UNDERLAP_X}px)`,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Visual visual={role.visual} timelineUnderlapPx={TIMELINE_UNDERLAP_X} />
          {role.widePlaceholder ? (
            <div style={{ marginTop: 32, width: "100%" }}>
              <WideVisualPlaceholder
                label={role.widePlaceholder.label ?? role.company}
                accent={role.widePlaceholder.accent}
                src={role.widePlaceholder.src}
              />
            </div>
          ) : null}
        </div>

        <aside
          style={{
            width: TIMELINE_ASIDE_WIDTH,
            position: "sticky",
            top: STICKY_TEXT_TOP,
            alignSelf: "start",
            zIndex: 2,
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            paddingLeft: 0,
          }}
        >
          <div>
            <div style={{ display: "flex", gap: 12, fontFamily: "var(--font-mono)", fontSize: 14, lineHeight: 1.43, marginBottom: 4 }}>
              <span style={{ color: "var(--accent)", letterSpacing: "0.02em", fontWeight: 500 }}>{role.year}</span>
              <span style={{ color: "var(--text)", opacity: 0.4 }}>/ {role.title}</span>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, lineHeight: 1.25, color: "var(--text)" }}>
              {role.company}
            </div>
          </div>

          {role.highlights.length > 0 ? (
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, lineHeight: 1.43, color: "var(--text)" }}>
              {role.highlights.map((h, i) => (
                <div key={i}>* {h}</div>
              ))}
            </div>
          ) : null}

          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 14,
              lineHeight: 1.43,
              color: "var(--text)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {role.sections.map((s, i) => (
              <p key={i} style={{ margin: 0 }}>
                {sectionBodyWithoutLabelPrefix(s.body)}
              </p>
            ))}
          </div>

          {role.asideFooter ? (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, lineHeight: 1.43, marginTop: 8 }}>
              <span
                style={{
                  color: "var(--text)",
                  opacity: 0.4,
                  fontStyle: "italic",
                }}
              >
                {role.asideFooter}
              </span>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

/* ─── Shared styles ───────────────────────────────────────────────────────── */

const containerStyle: CSSProperties = {
  width: "100%", maxWidth: 1120, margin: "0 auto", padding: "0 24px",
};
