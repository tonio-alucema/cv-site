import type { CSSProperties } from "react";
import type { Role } from "./data";

const TIER_STACK_GAP = 16;
const SMALL_PAIR_GAP = 16;

function TierPanel({
  accent,
  caption,
  title,
  subtitle,
  aspectRatio,
  minHeight,
}: {
  accent: string;
  caption?: string;
  title: string;
  subtitle?: string;
  aspectRatio: string;
  minHeight?: number;
}) {
  const shell: CSSProperties = {
    width: "100%",
    aspectRatio,
    minHeight,
    borderRadius: 12,
    background: "rgba(128, 128, 128, 0.2)",
    backdropFilter: "blur(44px)",
    border: `1px solid ${accent}44`,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 20,
  };

  return (
    <div style={shell}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: accent,
          opacity: 0.85,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {caption ?? "tier demo"}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 600,
          color: "#fff",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "rgba(255,255,255,0.45)",
            marginTop: 10,
            lineHeight: 1.45,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

const TIER_IMAGE_STYLE: CSSProperties = {
  width: "100%",
  height: "auto",
  display: "block",
  borderRadius: 12,
};

function ProjectMediaByTier({
  tiers,
  underlapPx,
  accent,
  heroAboveSmallRow,
  smallTierRow,
  smallTierRowExtra,
  mediumTierRow,
  mediumTierRowExtra,
  wideTierRow,
}: {
  tiers: ("small" | "medium" | "wide")[];
  underlapPx: number;
  accent: string;
  heroAboveSmallRow?: string;
  smallTierRow?: string;
  smallTierRowExtra?: string | string[];
  mediumTierRow?: string;
  mediumTierRowExtra?: string | string[];
  wideTierRow?: string;
}) {
  const timelineCol = `calc(100% - ${underlapPx}px)`;
  const firstSmallTierIndex = tiers.findIndex((t) => t === "small");
  const firstMediumTierIndex = tiers.findIndex((t) => t === "medium");
  const showHero =
    Boolean(heroAboveSmallRow) && firstSmallTierIndex !== -1;
  const smallTierRowExtras = smallTierRowExtra
    ? Array.isArray(smallTierRowExtra)
      ? smallTierRowExtra
      : [smallTierRowExtra]
    : [];
  const mediumTierRowExtras = mediumTierRowExtra
    ? Array.isArray(mediumTierRowExtra)
      ? mediumTierRowExtra
      : [mediumTierRowExtra]
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: TIER_STACK_GAP }}>
      {tiers.map((tier, i) => {
        if (tier === "small") {
          return (
            <div
              key={`small-${i}`}
              style={{
                width: timelineCol,
                display: "flex",
                flexDirection: "column",
                gap: TIER_STACK_GAP,
              }}
            >
              {showHero && i === firstSmallTierIndex && heroAboveSmallRow ? (
                <img
                  src={encodeURI(heroAboveSmallRow)}
                  alt=""
                  style={TIER_IMAGE_STYLE}
                />
              ) : null}
              {smallTierRow ? (
                <img
                  src={encodeURI(smallTierRow)}
                  alt=""
                  style={TIER_IMAGE_STYLE}
                />
              ) : (
              <div style={{ display: "flex", gap: SMALL_PAIR_GAP, alignItems: "stretch" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <TierPanel
                    accent={accent}
                    caption="Messenger · tier demo"
                    title="Small · A"
                    subtitle="~358px each @ max · 16px gutter · timeline imagery column"
                    aspectRatio="4 / 3"
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <TierPanel
                    accent={accent}
                    caption="Messenger · tier demo"
                    title="Small · B"
                    subtitle="2-up spans timeline column width"
                    aspectRatio="4 / 3"
                  />
                </div>
              </div>
              )}
              {smallTierRowExtras.map((src) => (
                <img
                  key={src}
                  src={encodeURI(src)}
                  alt=""
                  style={TIER_IMAGE_STYLE}
                />
              ))}
            </div>
          );
        }
        if (tier === "medium") {
          if (mediumTierRow && i === firstMediumTierIndex) {
            return (
              <div
                key={`medium-${i}`}
                style={{
                  width: timelineCol,
                  display: "flex",
                  flexDirection: "column",
                  gap: TIER_STACK_GAP,
                }}
              >
                {[mediumTierRow, ...mediumTierRowExtras].map((src) => (
                  <img
                    key={src}
                    src={encodeURI(src)}
                    alt=""
                    style={TIER_IMAGE_STYLE}
                  />
                ))}
              </div>
            );
          }
          if (mediumTierRow) return null;

          return (
            <div key={`medium-${i}`} style={{ width: timelineCol }}>
              <TierPanel
                accent={accent}
                caption="Messenger · tier demo"
                title="Medium"
                subtitle="~732px @ max · one unit spans timeline imagery column"
                aspectRatio="16 / 10"
              />
            </div>
          );
        }
        return (
          <div key={`wide-${i}`} style={{ width: "100%" }}>
            {wideTierRow ? (
              <img
                src={encodeURI(wideTierRow)}
                alt=""
                style={TIER_IMAGE_STYLE}
              />
            ) : (
            <TierPanel
              accent={accent}
              caption="Messenger · tier demo"
              title="Wide"
              subtitle="~1072px @ max · full inner container · passes under sticky rail"
              aspectRatio="12 / 5"
              minHeight={168}
            />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Visual({
  visual,
  timelineUnderlapPx = 340,
}: {
  visual: Role["visual"];
  /** Sidebar + grid gap; must match timeline row (`TIMELINE_UNDERLAP_X` in page). */
  timelineUnderlapPx?: number;
}) {
  if (visual.kind === "tiered") {
    return (
      <ProjectMediaByTier
        tiers={visual.tiers}
        underlapPx={timelineUnderlapPx}
        accent={visual.accent ?? "#60a5fa"}
        heroAboveSmallRow={visual.heroAboveSmallRow}
        smallTierRow={visual.smallTierRow}
        smallTierRowExtra={visual.smallTierRowExtra}
        mediumTierRow={visual.mediumTierRow}
        mediumTierRowExtra={visual.mediumTierRowExtra}
        wideTierRow={visual.wideTierRow}
      />
    );
  }

  if (visual.kind === "phone") {
    return (
      <div style={shellStyle}>
        <div
          style={{
            position: "absolute",
            inset: "13% 22% -27% 22%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 280,
              aspectRatio: "9 / 19",
              background: "#fff",
              borderRadius: 36,
              border: "0.5px solid #fff",
              boxShadow:
                "inset 0 0 0 2px #000, inset 0 0 0 3.5px #f7f7f7, inset 0 0 0 7px rgba(255,255,255,0.69), inset 0 0 0 18px #030303",
              padding: "70px 24px 0",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: "44%", height: 22, background: "#000", borderRadius: 12 }} />
            <div style={{ position: "absolute", top: "44%", left: 22, right: 22, color: "rgba(0,0,0,0.87)", fontSize: 22, fontWeight: 600, lineHeight: 1.2 }}>
              <div style={{ marginBottom: 4, fontSize: 18 }}>📺</div>
              <div>{visual.label}</div>
              <div style={{ marginTop: 8, fontSize: 15, color: "rgba(0,0,0,0.4)", fontWeight: 500, lineHeight: 1.25 }}>{visual.sub}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (visual.kind === "poster") {
    const accent = visual.accent || "#00D64F";
    return (
      <div style={{ ...shellStyle, padding: 36 }}>
        <div style={{ position: "absolute", inset: 0, padding: 36, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{ width: 96, height: 96, background: accent, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, color: "#fff", fontWeight: 800, fontFamily: "var(--font-display)" }}>$</div>
            <div style={{ fontSize: 88, lineHeight: 0.92, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", fontFamily: "var(--font-display)" }}>
              <div>Cash</div>
              <div>App</div>
              <div>Pay</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            <div style={{ background: "#fff", borderRadius: 14, padding: 12, width: 132 }}>
              <div style={{ width: "100%", aspectRatio: "1 / 1", background: "repeating-linear-gradient(0deg, #000 0 4px, transparent 4px 8px), repeating-linear-gradient(90deg, #000 0 4px, transparent 4px 8px)", borderRadius: 6 }} />
              <div style={{ marginTop: 8, fontSize: 10, color: "#333", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, background: accent, borderRadius: 3 }} />
                Cash App Pay
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, color: "#fff", fontWeight: 600, fontFamily: "var(--font-display)" }}>Scan to pay</div>
              <div style={{ height: 6, background: "#00B843", borderRadius: 4, marginTop: 12, width: "70%" }} />
              <div style={{ height: 6, background: "#00B843", borderRadius: 4, marginTop: 6, marginLeft: 18, width: "45%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (visual.kind === "card") {
    const accent = visual.accent || "#3dffd8";
    return (
      <div style={shellStyle}>
        <div
          style={{
            position: "absolute",
            inset: "10%",
            borderRadius: 12,
            background: `radial-gradient(ellipse at 30% 20%, ${accent}22, transparent 60%)`,
            border: `1px solid ${accent}22`,
            display: "flex",
            alignItems: "flex-end",
            padding: 28,
          }}
        >
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: accent, opacity: 0.7, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              placeholder
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>
              {visual.label}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/** Spans the timeline content column width (container max 1120px with page padding). */
export function WideVisualPlaceholder({
  label = "Placeholder",
  accent = "#3dffd8",
  src,
}: {
  label?: string;
  accent?: string;
  src?: string;
}) {
  if (src) {
    return (
      <img
        src={encodeURI(src)}
        alt={label}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          borderRadius: 12,
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "12 / 5",
        minHeight: 160,
        background: "rgba(128, 128, 128, 0.2)",
        backdropFilter: "blur(44px)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "5% 3%",
          borderRadius: 12,
          background: `radial-gradient(ellipse at 30% 20%, ${accent}22, transparent 60%)`,
          border: `1px solid ${accent}22`,
          display: "flex",
          alignItems: "flex-end",
          padding: 24,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: accent,
              opacity: 0.7,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            placeholder
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

const shellStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  aspectRatio: "1 / 1",
  background: "rgba(128, 128, 128, 0.2)",
  backdropFilter: "blur(44px)",
  borderRadius: 12,
  overflow: "hidden",
};
