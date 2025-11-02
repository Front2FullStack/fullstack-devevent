export type Event = {
  title: string;
  image: string; // path under /public
  slug: string;
  location: string;
  date: string; // human‑readable date
  time: string; // human‑readable time range
};

// Realistic upcoming/popular developer events — images reference files in /public/images
export const allEvents: Event[] = [
  {
    title: "React Summit US 2025",
    image: "/images/event1.png",
    slug: "react-summit-us-2025",
    location: "New York, USA",
    date: "November 12–14, 2025",
    time: "9:00 AM – 5:30 PM"
  },
  {
    title: "AWS re:Invent 2025",
    image: "/images/event2.png",
    slug: "aws-reinvent-2025",
    location: "Las Vegas, USA",
    date: "December 1–5, 2025",
    time: "8:30 AM – 6:00 PM"
  },
  {
    title: "HackMIT 2025",
    image: "/images/event3.png",
    slug: "hackmit-2025",
    location: "Cambridge, USA",
    date: "September 20–21, 2025",
    time: "36‑hour hackathon"
  },
  {
    title: "Web Summit 2025",
    image: "/images/event4.png",
    slug: "web-summit-2025",
    location: "Lisbon, Portugal",
    date: "November 3–6, 2025",
    time: "9:00 AM – 6:00 PM"
  },
  {
    title: "KubeCon + CloudNativeCon Europe 2026",
    image: "/images/event5.png",
    slug: "kubecon-cloudnativecon-europe-2026",
    location: "Amsterdam, Netherlands",
    date: "March 24–27, 2026",
    time: "9:00 AM – 5:30 PM"
  },
  {
    title: "Google I/O 2026",
    image: "/images/event6.png",
    slug: "google-io-2026",
    location: "Mountain View, USA (Shoreline Amphitheatre) / Online",
    date: "May 2026 (TBA)",
    time: "Keynotes + sessions (TBA)"
  }
];
