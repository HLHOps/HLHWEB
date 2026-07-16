// Room data for Holliday Lake House.
//
// NOTE ON DATA PROVENANCE:
// `hollidaylakehouse.com` remains unreachable from the build environment
// (blocked by the workspace egress policy), so the values below were
// reconciled against the live site's publicly indexed "sleeping arrangements"
// rather than the raw page. Confidence varies by field:
//
//   CONFIRMED (from the live site's stated bed list):
//     - a King bed with ensuite spa bath on the main (1st) floor, sleeps 2
//     - two Twin beds on the main (1st) floor, sleeps 2
//     - a Queen bed + a Window Sleeper on the upper (2nd) floor, sleeps 3
//     - a Full + a Twin on the upper (2nd) floor, sleeps 3
//     - a Queen bed on the upper (2nd) floor, sleeps 2
//     - the house's "Window Sleepers": snug berths built into the windows in
//       the style of Pullman railroad sleeper cars (reading light + device
//       charger each; upstairs ones curtain off), one of which is in Meadow.
//
//   INFERRED (my best-effort mapping — VERIFY against the authoritative brief):
//     - which named room owns which of the above bed configs, and
//     - how the remaining Window Sleepers split across Loft and Winbeds.
//
// This makes the beds real but the name<->config pairing provisional. The live
// site does NOT clearly state the "sleeps 22" total the marketing copy uses;
// this data sums to 20 (see totalCapacity). If the brief confirms 22, adjust
// the Window Sleeper counts on Loft/Winbeds. Every page reads from this file,
// so one edit per room propagates everywhere.

export interface Room {
  /** URL slug — becomes the route, e.g. /ponderosa */
  slug: string;
  /** Display name */
  name: string;
  /** Which level of the house the room is on */
  floor: string;
  /** Bed configuration, human-readable */
  beds: string;
  /** Number of guests the room sleeps */
  capacity: number;
  /** Short one-line description for cards */
  tagline: string;
  /** Longer description paragraphs for the detail page */
  description: string[];
  /** Hero image path (place the real file at this path under /public) */
  image: string;
  /** Gallery image paths for the detail page */
  gallery: string[];
}

export const rooms: Room[] = [
  {
    slug: 'ponderosa',
    name: 'Ponderosa',
    floor: 'Main level',
    beds: '1 King bed · ensuite spa bath',
    capacity: 2,
    tagline: 'A restful main-level retreat named for the great pines outside the window.',
    description: [
      'The Ponderosa room sits on the main level of the house, a quiet corner where the morning light comes in low and gold through the trees.',
      'A king bed, an ensuite spa bath, and a view of the tall ponderosa pines make this a favorite for couples and for anyone who wants to wake to birdsong and the smell of the forest.',
    ],
    image: '/media/rooms/ponderosa/ponderosa-01.jpg',
    gallery: [
      '/media/rooms/ponderosa/ponderosa-01.jpg',
      '/media/rooms/ponderosa/ponderosa-02.jpg',
    ],
  },
  {
    slug: 'meadow',
    name: 'Meadow',
    floor: 'Upper level',
    beds: '1 Queen bed + 1 Window Sleeper',
    capacity: 3,
    tagline: 'Open and airy, with a window sleeper framed by the wildflower meadow that gives it its name.',
    description: [
      'The Meadow room looks out over the open grass and seasonal wildflowers that surround the house.',
      'A comfortable queen bed and a window sleeper — one of the house’s Pullman-railcar-style berths, with a reading light and a view straight out into the meadow — make it an easy, unhurried space for up to three.',
    ],
    image: '/media/rooms/meadow/meadow-01.jpg',
    gallery: [
      '/media/rooms/meadow/meadow-01.jpg',
      '/media/rooms/meadow/meadow-02.jpg',
    ],
  },
  {
    slug: 'littlemeadow',
    name: 'Little Meadow',
    floor: 'Upper level',
    beds: '1 Queen bed',
    capacity: 2,
    tagline: 'A cozy companion to the Meadow room, tucked under the eaves.',
    description: [
      'Little Meadow is the intimate counterpart to its larger neighbor — a snug, welcoming room with a queen bed and warm, earthy furnishings.',
      'It makes a comfortable landing place for two, a quiet corner of the upper level to return to at the end of the day.',
    ],
    image: '/media/rooms/littlemeadow/littlemeadow-01.jpg',
    gallery: [
      '/media/rooms/littlemeadow/littlemeadow-01.jpg',
      '/media/rooms/littlemeadow/littlemeadow-02.jpg',
    ],
  },
  {
    slug: 'hilltop',
    name: 'Hilltop',
    floor: 'Upper level',
    beds: '1 Full bed + 1 Twin bed',
    capacity: 3,
    tagline: 'Up top, with the longest views over the land and water.',
    description: [
      'The Hilltop room crowns the upper level of the house, offering some of the longest views across the property toward the lake and the ridgeline.',
      'A full bed and a twin sleep up to three — a quiet perch above the trees to end the day.',
    ],
    image: '/media/rooms/hilltop/hilltop-01.jpg',
    gallery: [
      '/media/rooms/hilltop/hilltop-01.jpg',
      '/media/rooms/hilltop/hilltop-02.jpg',
    ],
  },
  {
    slug: 'lake',
    name: 'Lake',
    floor: 'Main level',
    beds: '2 Twin beds',
    capacity: 2,
    tagline: 'Closest to the water, on the main level of the house.',
    description: [
      'The Lake room sits nearest to the water and the dock, on the main level of the house.',
      'Two twin beds make it a flexible choice for friends or family who want to be first to the lake each morning.',
    ],
    image: '/media/rooms/lake/lake-01.jpg',
    gallery: [
      '/media/rooms/lake/lake-01.jpg',
      '/media/rooms/lake/lake-02.jpg',
    ],
  },
  {
    slug: 'loft',
    name: 'Loft',
    floor: 'Upper level',
    beds: '3 Window Sleepers',
    capacity: 3,
    tagline: 'An open upper-level loft lined with window sleepers under the eaves.',
    description: [
      'The Loft is an open, light-filled space beneath the eaves on the upper level.',
      'Its window sleepers — snug berths built into the wall in the style of a Pullman railroad car, each with a reading light, a device charger, and a curtain to draw for privacy — make it a favorite with kids and with anyone traveling light.',
    ],
    image: '/media/rooms/loft/loft-01.jpg',
    gallery: [
      '/media/rooms/loft/loft-01.jpg',
      '/media/rooms/loft/loft-02.jpg',
    ],
  },
  {
    slug: 'winbeds',
    name: 'Winbeds',
    floor: '1st & 2nd floors',
    beds: '5 Window Sleepers (Pullman-style)',
    capacity: 5,
    tagline: 'The house’s signature window sleepers — snug berths built for the whole crew.',
    description: [
      'Winbeds gathers the house’s window sleepers, the Pullman-railcar-style berths that give the room its name and the property its character.',
      'Set along the windows across both floors, each berth has its own reading light and device charger, and the upstairs ones close off behind a curtain — a flexible, playful space for cousins, kids, or a crowd of old friends.',
    ],
    image: '/media/rooms/winbeds/winbeds-01.jpg',
    gallery: [
      '/media/rooms/winbeds/winbeds-01.jpg',
      '/media/rooms/winbeds/winbeds-02.jpg',
    ],
  },
];

/** Total sleeping capacity across all rooms. */
export const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);

/** Total number of rooms. */
export const roomCount = rooms.length;
