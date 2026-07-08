// Homepage content — ported from the Claude Design handoff
// (project/Homepage Directions.dc.html, option 1a "Program").

export type ProjectItem = {
  idx: number;
  w: number; // case width in the 3D concourse (px)
  ch: string;
  file: string;
  title: string;
  sub: string;
};

export const PROJECT_ITEMS: ProjectItem[] = [
  { idx: 0, w: 340, ch: "CH 01", file: "/home/posters/reba.webp", title: "Reba", sub: "Live at Madison Square Garden" },
  { idx: 1, w: 538, ch: "CH 02", file: "/home/posters/alicia-keys.webp", title: "Alicia Keys", sub: "The Diary of Alicia Keys 20 — streaming live from Webster Hall" },
  { idx: 2, w: 306, ch: "CH 03", file: "/home/posters/fall-out-boy.webp", title: "Fall Out Boy", sub: "Live from Madison Square Garden" },
  { idx: 3, w: 434, ch: "CH 04", file: "/home/posters/garden-state.webp", title: "Garden State", sub: "20th Anniversary Concert — global livestream" },
  { idx: 4, w: 364, ch: "CH 05", file: "/home/posters/rascal-flatts.webp", title: "Rascal Flatts", sub: "Life Is A Highway Tour — celebrating 25 years" },
  { idx: 5, w: 364, ch: "CH 06", file: "/home/posters/mary-j-blige.webp", title: "Mary J. Blige", sub: "For My Fans — live from Madison Square Garden — in cinemas" },
  { idx: 6, w: 432, ch: "CH 07", file: "/home/posters/elton-john.webp", title: "Elton John", sub: "Curebound — Concert for Cures — Petco Park" },
];

export type ServiceRole = { name: string; desc: string };
export type Service = {
  title: string;
  indent: number; // staggered poster-line indent (px, desktop)
  note: string; // mono annotation chip
  body: string;
  roles?: ServiceRole[];
};

export const SERVICES: Service[] = [
  {
    title: "Cinematic Multicam Concert Films & Livestreams",
    indent: 0,
    note: "01 — Concert film, livestream, or both",
    body: "We shoot live concerts on cinema cameras across every key angle and cut live in real time. You get a finished concert film, a broadcast-grade livestream, or both — shaded to match, graded in HDR, handled top to bottom. One night of coverage, built to release, stream, and keep earning long after the lights come up.",
  },
  {
    title: "Festival & Touring IMAG",
    indent: 120,
    note: "02 — Turnkey, travels with the tour",
    body: "We put a clean, cinematic picture on the big screens so the whole crowd sees the show — cameras, switching, and engineering, cut live for the back row. A turnkey package that travels: we bring the full signal chain and integrate with your stage and video teams, from a single headline set to a full festival run. One less thing for production to worry about, whether it's one date or the whole tour.",
  },
  {
    title: "Corporate & Brand Events",
    indent: 40,
    note: "03 — Clean alongside your AV",
    body: "Broadcast-quality video for conferences, keynotes, product launches, and brand activations. You get multicamera capture, IMAG for the room, a livestream to everyone who couldn't make it, and clean recordings for post — a turnkey package handled top to bottom. We integrate with your AV, staging, and event teams and deliver a picture that looks the way the brand is supposed to look.",
  },
  {
    title: "Galas & Fundraisers",
    indent: 180,
    note: "04 — Quiet in the room",
    body: "Full video support for galas, benefits, and fundraising nights. You get cameras and IMAG so every guest sees the stage, program feeds for live giving or streaming, and polished recordings for recap and donor content — start to finish, so the committee doesn't have to think about it. We know the pace and the formality of these evenings, and we run quietly and reliably in the room when it matters most.",
  },
  {
    title: "Technical Resources",
    indent: 70,
    note: "05 — Eight positions, one call",
    body: "Experienced broadcast crew and engineering to staff your production or supplement your team:",
    roles: [
      { name: "Technical Management", desc: "Oversight of the video production, from planning through show day." },
      { name: "System Engineers", desc: "Design and setup of a reliable broadcast signal chain." },
      { name: "Camera Specialists", desc: "Operators for cinema, broadcast, and specialty positions." },
      { name: "DITs", desc: "Media, data, and color pipeline management with on-set image integrity." },
      { name: "Utilities", desc: "Cabling, deployment, and keeping the production running." },
      { name: "Camera Assistants", desc: "Focus, builds, and lens/support for camera ops." },
      { name: "Comms", desc: "Intercom systems that keep the crew connected." },
      { name: "RF Video", desc: "Wireless camera systems for mobile and hard-to-cable positions." },
    ],
  },
];

export const EVENT_TYPES = [
  "Concert film / livestream",
  "Festival & touring IMAG",
  "Corporate & brand event",
  "Gala / fundraiser",
  "Crew & technical resources",
];
