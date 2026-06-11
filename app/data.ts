export type Role = {
  year: string;
  title: string;
  company: string;
  highlights: string[];
  sections: { label: string; body: string }[];
  visual:
    | {
        kind: "phone";
        label?: string;
        sub?: string;
      }
    | {
        kind: "poster";
        label?: string;
        accent?: string;
      }
    | {
        kind: "card";
        label?: string;
        accent?: string;
        bg?: string;
      }
    | {
        kind: "tiered";
        /** Showcase order: small (×2), medium (×1), wide (full bleed under sticky rail). */
        tiers: ("small" | "medium" | "wide")[];
        accent?: string;
        /** Optional image above the first 2-up small row (timeline column width). Public path, may include spaces. */
        heroAboveSmallRow?: string;
        /** Optional image replacing the default 2-up small tier placeholders. */
        smallTierRow?: string;
        /** Optional image(s) stacked below smallTierRow at the same width. */
        smallTierRowExtra?: string | string[];
        /** Optional image replacing the default medium tier placeholder (fits 16/10 column). */
        mediumTierRow?: string;
        /** Optional image(s) stacked below mediumTierRow at the same width. */
        mediumTierRowExtra?: string | string[];
        /** Optional image replacing the default wide tier placeholder. */
        wideTierRow?: string;
      };
  /** Full-width block below the row (same width as container: max 1120px minus horizontal padding). */
  widePlaceholder?: {
    label?: string;
    accent?: string;
    /** When set, replaces the default placeholder with this image. */
    src?: string;
  };
  /** Optional italic tagline in the sticky aside footer. */
  asideFooter?: string;
};

export const HERO = {
  prompt: "cat about.md",
  cwd: "~/cv",
  name: "Tonio Alucema",
  headline:
    "Design, motion and a growing obsession with code… two decades shaping how people move through the internets.",
  email: "hello@tonioalucema.com",
  links: {
    soul: "soul.md",
    twitter: "https://x.com/tonioalucema",
    github: "https://github.com/tonio-alucema",
  },
};

/** Three-column markdown-style blocks (soul.md / arc.md panels). */
export type SoulMdContent = {
  /** Optional ASCII block shown centered above the three columns (e.g. arc.md timeline). */
  asciiDiagram?: string;
  /** When set, panel shows only the custom arc diagram (no ASCII / three columns). */
  diagramOnly?: boolean;
  /** Body paragraph below the arc SVGs (diagramOnly panels only). */
  arcBlurb?: string;
  pointOfView: { title: string; body: string };
  tools: { title: string; list: string[]; notes: string[] };
  achievements: { title: string; items: string[] };
};

export const SOUL_MD: SoulMdContent = {
  pointOfView: {
    title: "# point of view",
    body:
      "We're at a very unique and exciting moment in history… AI is EVERYWHERE, but there's still a massive gap between what's being shipped and what everyday people can actually understand, trust or interact with. That's the gap I care most about closing by moving strategically, prototyping constantly and getting closer and closer to the code that brings designs to life. That’s what drives me to keep collaborating, keep learning, and keep translating technology back into something genuinely human.",
  },
  tools: {
    title: "# tools",
    list: [
      "Figma / Adobe Suite",
      "Claude Code",
      "Cursor",
      "Tailwind CSS",
      "GSAP / Framer Motion",

    ],
    notes: [
      "Visual design background",
      "Proficient in animation theory",
      "Bilingual speaker (Spanish)",
    ],
  },
  achievements: {
    title: "# milestones",
    items: [
      "2024 – Cambly Lesson Review launch",
      "2022 – Cash App Pay launch",
      "2020 – Messenger Watch Together launch",
      "2015 – Apple Music launch",
      "2011 – Microsoft Xbox OS redesign",
      "2004 – Grafic Park studio opens doors",
      "2000 – Art Institute of Houston",
    ],
  },
};

export const ARCH_MD: SoulMdContent = {
  diagramOnly: true,
  arcBlurb:
    "From designing my first rave flyer in Houston to shipping global products at Apple, Meta, Pinterest and Block — every chapter has been a deliberate bet on what comes next. Right now that bet is on the intersection of design and code. ♥",
  pointOfView: { title: "", body: "" },
  tools: { title: "", list: [], notes: [] },
  achievements: { title: "", items: [] },
};

export const ROLES: Role[] = [
  {
    year: "2025",
    title: "Product designer",
    company: "Square",
    /*asideFooter: "Grocery, convenience and the unglamorous parts of POS",*/
    highlights: [],
    sections: [
      {
        label: "EBT / SNAP",
        body: " – Led design for EBT / SNAP acceptance, partnering with multiple teams (NYCE, Payments, Orders and Legal) to launch a closed Alpha with hand-picked sellers — Square's first credible step toward a long-requested payment type.",
      },
      /*{
        label: "Item Sheet & catalog",
        body: " – Explored refreshing the Item Sheet for clarity and began a broader audit of how catalog and inventory units are modeled across the platform.",
      },*/
      {
        label: "Grocery & retail",
        body: " – Helped earn back trust with grocery and retail sellers through small but mighty updates/features — bottle deposit support, geo-based taxes, and general UI improvements.",
      },
    ],
    visual: {
      kind: "tiered",
      tiers: ["small", "wide"],
      accent: "#94a3b8",
      heroAboveSmallRow: "/project images/ebt hero 2.svg",
      smallTierRow: "/project images/ebt-cardgrid.svg",
      wideTierRow: "/project images/ebt-wideheadline.svg",
    },
  },
  {
    year: "2023",
    title: "Product designer",
    company: "Cambly",
    highlights: [],
    sections: [
      {
        label: "Post-lesson suite",
        body: " – Designed and shipped a 0→1 suite of post-lesson features – scrubbable transcripts, AI-generated feedback and summaries... all built around the moment a tutor and student finish a lesson together.",
      },
      {
        label: "AI in the loop",
        body: " – Collaborated with prompt eng to design how corrective AI-generated feedback gets surfaced to students... one step further and also explored surfacing positive “moments”.",
      },
      {
        label: "Rebrand",
        body: " – Bridged a company-wide rebrand into the product itself, exploring a refreshed classroom UI alongside the brand team.",
      },
    ],
    visual: {
      kind: "tiered",
      tiers: ["small", "wide"],
      accent: "#94a3b8",
      heroAboveSmallRow: "/project images/cam-hero-med.svg",
      smallTierRow: "/project images/cam-3screens-med.svg",
      smallTierRowExtra: "/project images/cam-flywheel-med.svg",
      wideTierRow: "/project images/cambly-wire-wide.svg",
    },
  },
  {
    year: "2021",
    title: "Product designer",
    company: "Cash App",
    highlights: [],
    sections: [
      {
        label: "Cash App Pay",
        body: " – Launched Cash App Pay, the company's first payment network — an in-network contactless way to pay merchants in person and online.",
      },
      {
        label: "Buy Now Pay Later",
        body: " – Launched Cash App's first Buy Now Pay Later experience “Single use payment” as part of the Afterpay acquisition; led strategy and product vision before handing off to engineering.",
      },
      {
        label: "Cross-functional",
        body: " – Worked across some of the most cross-functional rooms of my career — Product, Legal, UXR, Brand & Business Dev.",
      },
    ],
    visual: {
      kind: "tiered",
      tiers: ["medium"],
      accent: "#60a5fa",
      mediumTierRow: "/project images/blank-med.svg",
    },
  },
  {
    year: "2018",
    title: "Product designer",
    company: "Meta · Messenger",
    highlights: [],
    sections: [
      {
        label: "Watch Together",
        body: " – Launched Messenger’s Watch Together, a 0→1 co-watching video experience that shipped globally.",
      },
      {
        label: "Co-experiences",
        body: " – Helped shape the framework that unified screen sharing, filters, and future co-experiences across the Realtime Connection team.",
      },
      {
        label: "Infrastructure",
        body: " – Supported design through a full Messenger infrastructure rewrite — a humbling lesson in how much great design depends on the foundation underneath it.",
      },
    ],
    visual: {
      kind: "tiered",
      tiers: ["medium", "wide"],
      accent: "#60a5fa",
      mediumTierRow: "/project images/blank-med.svg",
      wideTierRow: "/project images/mess-hero-wide.png",
    },
  },
  {
    year: "2015",
    title: "Product designer",
    company: "Pinterest",
    highlights: [],
    sections: [
      {
        label: "Explore",
        body: " – Launched Pinterest Explore, a 0→1 discovery tab spanning iOS, Android, and desktop..",
      },
      {
        label: "Search & personalization",
        body: " – Worked on the core Search team and contributed to early personalization projects — Home Decor quiz, Food Type & Skin Tone filters which pushed the product toward more inclusive search results.",
      },
      {
        label: "Ownership",
        body: " – * The role where I first owned the full surface as a product designer, not just the motion or prototyping pass.",
      },
    ],
    visual: {
      kind: "tiered",
      tiers: ["medium", "wide"],
      accent: "#60a5fa",
      mediumTierRow: "/project images/pin-collage-med.png",
      wideTierRow: "/project images/pin-hero-wide.png",
    },
  },
  {
    year: "2013",
    title: "UX motion designer",
    company: "Apple Music • iTunes",
    highlights: [],
    sections: [
      {
        label: "Apple Music",
        body: " – Joined iTunes through the Beats Music acquisition and helped support design for the global launch of Apple Music.",
      },
      {
        label: "Motion & exploration",
        body: " – Focused on system-level animations, exploratory artist tools, and motion for high-level leadership pitches.",
      },
      /*{
        label: "Team",
        body: " – Quietly one of the most formative rooms I’ve ever been in — watching a streaming product be born inside a company that had defined an era.",
      },*/
    ],
    visual: {
      kind: "tiered",
      tiers: ["medium"],
      accent: "#60a5fa",
      mediumTierRow: "/project images/appl-3.jpg",
      mediumTierRowExtra: [
        "/project images/appl-2.jpg",
        "/project images/appl-1.jpeg",
      ],
    },
  },
  {
    year: "2013",
    title: "UX motion designer",
    company: "Beats Music",
    highlights: [],
    sections: [
      {
        label: "Product",
        body: " – Prototyped new features and built system animations across iOS, Android, and desktop.",
      },
      {
        label: "Vision selling",
        body: " – Designed motion for high-level pitches — the kind of work where animation has to sell a vision before the product exists.",
      },
      /*{
        label: "Craft",
        body: " – Beats was the first place I really understood that motion isn’t decoration; it’s the connective tissue of a product.",
      },*/
    ],
    visual: {
      kind: "tiered",
      tiers: ["medium"],
      accent: "#60a5fa",
      mediumTierRow: "/project images/beats-1.jpg",
    },
  },
  /*{
    year: "2011",
    title: "UX motion designer",
    company: "HTC Mobile",
    highlights: ["Sense 5.0 consulting", "Cross-surface prototypes", "Leadership pitches"],
    sections: [
      {
        label: "Shipped work",
        body: " – Prototyped features across mobile, web, and TV, and consulted on HTC’s flagship mobile OS, Sense 5.0.",
      },
      {
        label: "Narrative",
        body: " – Created motion-driven leadership pitches that helped sell new product directions internally.",
      },
    ],
    visual: {
      kind: "tiered",
      tiers: ["small", "medium", "wide"],
      accent: "#60a5fa",
    },
  },
  {
    year: "2011",
    title: "UX motion designer",
    company: "Microsoft Xbox",
    highlights: ["Xbox OS motion language", "Voice / Kinnect exploration"],
    sections: [
      {
        label: "OS motion",
        body: " – Helped develop and ship the motion language for the Xbox OS (2011) redesign.",
      },
      {
        label: "Voice",
        body: " – Explored voice interface improvements for the Kinect platform — early hands-on with conversational UX before that was even a phrase.",
      },
    ],
    visual: {
      kind: "tiered",
      tiers: ["small", "medium", "wide"],
      accent: "#60a5fa",
    },
  },
  {
    year: "2004",
    title: "Co-founder · Designer",
    company: "Grafic Park",
    highlights: ["Houston studio", "Identity, print, early web", "Craft + running a business"],
    sections: [
      {
        label: "Studio",
        body: " – Co-founded a small Houston design studio with friends, focused on identity, print, and early web work.",
      },
      {
        label: "Lesson",
        body: " – The chapter where I learned that craft is only half of the job — the other half is keeping a small business alive.",
      },
    ],
    visual: { kind: "card", label: "Grafic Park", accent: "#a8a29e" },
  },*/
  {
    year: "1990s",
    title: "Print designer",
    company: "Noise Design Lab",
    highlights: [],
    sections: [
      {
        label: "Role",
        body: " – Sole graphic designer at a fast-turnaround print shop — where I learned to design under real deadlines, with real ink, and real consequences.",
      },
    ],
    visual: {
      kind: "tiered",
      tiers: ["medium"],
      accent: "#78716c",
      mediumTierRow: "/project images/flyer-med.png",
    },
  },
];
