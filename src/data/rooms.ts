// Room data for Holliday Lake House.
//
// NOTE ON DATA PROVENANCE:
// The bed configurations and per-room capacities below are PLACEHOLDERS that
// sum to the brief's stated totals (7 rooms, sleeps 22). The migration brief's
// exact per-room "beds / floor / capacity" figures were not available in the
// build environment (the source site host is blocked by egress policy). Update
// the `floor`, `beds`, and `capacity` fields here once the authoritative brief
// values are confirmed — every page reads from this file, so one edit per room
// propagates everywhere.

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
    beds: '1 King bed',
    capacity: 2,
    tagline: 'A restful main-level retreat named for the great pines outside the window.',
    description: [
      'The Ponderosa room sits on the main level of the house, a quiet corner where the morning light comes in low and gold through the trees.',
      'A king bed, soft linens, and a view of the tall ponderosa pines make this a favorite for couples and for anyone who wants to wake to birdsong and the smell of the forest.',
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
    floor: 'Main level',
    beds: '1 Queen bed',
    capacity: 2,
    tagline: 'Open, airy, and framed by the wildflower meadow that gives it its name.',
    description: [
      'The Meadow room looks out over the open grass and seasonal wildflowers that surround the house.',
      'With a comfortable queen bed and plenty of natural light, it is an easy, unhurried space to rest between days on the lake and the land.',
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
    floor: 'Main level',
    beds: '1 Queen bed',
    capacity: 2,
    tagline: 'A cozy companion to the Meadow room, tucked close to the garden.',
    description: [
      'Little Meadow is the intimate counterpart to its larger neighbor — a snug, welcoming room close to the garden and the meadow beyond.',
      'A queen bed and warm, earthy furnishings make it a comfortable landing place for two.',
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
    beds: '1 King bed',
    capacity: 2,
    tagline: 'Up top, with the longest views over the land and water.',
    description: [
      'The Hilltop room crowns the upper level of the house, offering some of the longest views across the property toward the lake and the ridgeline.',
      'A king bed and a quiet perch above the trees make it a peaceful place to end the day.',
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
    floor: 'Lower level',
    beds: '2 Queen beds',
    capacity: 4,
    tagline: 'Closest to the water, made for families and friends.',
    description: [
      'The Lake room sits on the lower level, nearest to the water and the dock.',
      'With two queen beds it comfortably sleeps four, making it a natural choice for families or friends who want to be first to the lake each morning.',
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
    beds: '2 Queen beds',
    capacity: 4,
    tagline: 'An open upper-level loft under the eaves of the house.',
    description: [
      'The Loft is an open, light-filled space beneath the eaves on the upper level.',
      'Two queen beds and a relaxed, communal feel make it ideal for a group traveling together — or for kids who want a space of their own.',
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
    floor: 'Lower level',
    beds: '3 Bunk beds (6 twins)',
    capacity: 6,
    tagline: 'The bunk room — a playful, flexible space that sleeps the whole crew.',
    description: [
      'Winbeds is the house’s bunk room, a flexible lower-level space built for the extra guests every good gathering brings.',
      'Three sets of bunk beds sleep up to six, making it the perfect spot for cousins, kids, or a crowd of old friends.',
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
