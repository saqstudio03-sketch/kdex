import type { Review } from "@/types";
import { inDays } from "./products.builder";

const day = (n: number) => inDays(-n);

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "g01",
    productTitle: "Neon Revenant",
    user: "arjun_vp",
    rating: 5,
    title: "Best ₹1,499 I've spent all year",
    comment:
      "The combat loops are insanely tight and the city actually feels alive. Key arrived instantly and activated on Steam with zero issues.",
    date: day(2),
    verified: true,
    status: "approved",
  },
  {
    id: "r2",
    productId: "g02",
    productTitle: "Ashfall Protocol",
    user: "meera.k",
    rating: 4,
    title: "Squad nights are back",
    comment:
      "Extraction tension is unmatched. Needs better servers during peak hours, but the ash-storm mechanic is genius.",
    date: day(5),
    verified: true,
    status: "approved",
  },
  {
    id: "r3",
    productId: "g03",
    productTitle: "Skywarden Legends",
    user: "dragonlair_tvm",
    rating: 5,
    title: "A proper 60-hour RPG",
    comment:
      "Turn-based combat with real depth, and my dragon actually died in act two because of a choice I made. Devastating. Loved it.",
    date: day(8),
    verified: true,
    status: "approved",
  },
  {
    id: "r4",
    productId: "g04",
    productTitle: "Velocity Drift Xtreme",
    user: "nightowl_88",
    rating: 4,
    title: "Drift physics feel great on controller",
    comment:
      "Deal price made it an instant buy. Photo mode is beautiful, handling could use one more tuning pass.",
    date: day(11),
    verified: true,
    status: "approved",
  },
  {
    id: "r5",
    productId: "g05",
    productTitle: "The Haunting of Blackmere Manor",
    user: "fearful_farah",
    rating: 5,
    title: "I had to sleep with the lights on",
    comment:
      "No jump scares, just dread. The manor reshaping itself had me screenshotting every room. Headphones mandatory.",
    date: day(14),
    verified: true,
    status: "approved",
  },
  {
    id: "r6",
    productId: "g10",
    productTitle: "Titan Breaker",
    user: "climb_or_die",
    rating: 4,
    title: "Climbing a walking tank never gets old",
    comment:
      "Boss encounters are spectacular. Main story is a little predictable, but the moment-to-moment gameplay carries it.",
    date: day(17),
    verified: true,
    status: "approved",
  },
  {
    id: "r7",
    productId: "g13",
    productTitle: "Mech Sovereigns",
    user: "deckbuilder_ash",
    rating: 5,
    title: "Slay-the-Ring meets mech tactics",
    comment:
      "Runs perfectly on Steam Deck. Ranked mode is surprisingly deep for a small studio debut.",
    date: day(20),
    verified: true,
    status: "approved",
  },
  {
    id: "r8",
    productId: "g19",
    productTitle: "Crimson Covenant",
    user: "souls_veteran",
    rating: 4,
    title: "Tough but fair",
    comment:
      "Boss telegraphs are clean once you learn them. Co-op dungeons with friends are a highlight.",
    date: day(23),
    verified: true,
    status: "approved",
  },
  {
    id: "r9",
    productId: "g12",
    productTitle: "Cricket Champion 26",
    user: "kerala_cricket",
    rating: 4,
    title: "Finally a good cricket game",
    comment:
      "Bowling animations feel natural and career mode has proper progression. Commentary could be varied.",
    date: day(26),
    verified: true,
    status: "approved",
  },
  {
    id: "r10",
    productId: "g18",
    productTitle: "Shadowbyte",
    user: "pixel_perfect",
    rating: 5,
    title: "Short, brutal, perfect",
    comment:
      "Four hours of pure stealth puzzles. Deaths teach you instead of punishing you. Worth every rupee.",
    date: day(29),
    verified: true,
    status: "approved",
  },
  {
    id: "r11",
    productId: "g16",
    productTitle: "Deep Vault",
    user: "admin_tester",
    rating: 3,
    title: "Great concept, rough edges",
    comment:
      "Management systems are deep but the late game needs balance patches. Waiting for the next update.",
    date: day(3),
    verified: true,
    status: "pending",
  },
  {
    id: "r12",
    productId: "g08",
    productTitle: "Solaris Arena",
    user: "anon_284",
    rating: 2,
    title: "Matchmaking needs work",
    comment:
      "Fun when you get a balanced lobby, frustrating otherwise. Hoping ranked fixes the skill gaps.",
    date: day(6),
    verified: false,
    status: "pending",
  },
];

export const approvedReviews = reviews.filter((r) => r.status === "approved");
