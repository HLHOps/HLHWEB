// Room data for Holliday Lake House.
//
// The per-room bed configurations, floors, and capacities below are the
// authoritative figures from the migration brief (7 rooms, sleeps 22). Every
// page reads from this file, so one edit per room propagates everywhere.

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
    floor: '1st floor',
    beds: 'King, ensuite spa bath',
    capacity: 2,
    tagline: 'A restful first-floor retreat named for the great pines outside the window.',
    description: [
      'The Ponderosa room sits on the first floor of the house, a quiet corner where the morning light comes in low and gold through the trees.',
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
    floor: '2nd floor',
    beds: 'Queen + window sleeper',
    capacity: 3,
    tagline: 'Open, airy, and framed by the wildflower meadow that gives it its name.',
    description: [
      'The Meadow room looks out over the open grass and seasonal wildflowers that surround the house.',
      'A queen bed and a window sleeper sleep up to three, with plenty of natural light — an easy, unhurried space to rest between days on the lake and the land.',
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
    floor: '2nd floor',
    beds: '2 twin beds + crib space (accessed via Meadow)',
    capacity: 2,
    tagline: 'A cozy companion to the Meadow room, accessed through it.',
    description: [
      'Little Meadow is the intimate counterpart to its larger neighbor — a snug, welcoming room reached through the Meadow room, with the garden and meadow beyond.',
      'Two twin beds and space for a crib make it a comfortable, flexible spot for two, or for little ones close to the family.',
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
    floor: '2nd floor',
    beds: 'Full + twin bed',
    capacity: 3,
    tagline: 'Up top, with the longest views over the land and water.',
    description: [
      'The Hilltop room crowns the second floor of the house, offering some of the longest views across the property toward the lake and the ridgeline.',
      'A full bed and a twin bed sleep up to three, and a quiet perch above the trees makes it a peaceful place to end the day.',
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
    floor: '1st floor',
    beds: 'King or 2 twins (configurable)',
    capacity: 2,
    tagline: 'Closest to the water, and configurable to suit your party.',
    description: [
      'The Lake room sits on the first floor, nearest to the water and the dock.',
      'Configurable as a king or two twin beds, it sleeps two — a natural choice for whoever wants to be first to the lake each morning.',
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
    floor: '2nd floor',
    beds: 'Queen bed, common area',
    capacity: 2,
    tagline: 'An open second-floor loft under the eaves of the house.',
    description: [
      'The Loft is an open, light-filled space beneath the eaves on the second floor.',
      'A queen bed and an adjoining common area give it a relaxed, sociable feel — a comfortable retreat for two at the heart of the upstairs.',
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
    floor: '1st & 2nd floor',
    beds: '8 Pullman-style window sleeper beds',
    capacity: 8,
    tagline: 'The window-bed room — a playful, flexible space that sleeps the whole crew.',
    description: [
      'Winbeds is the house’s window-bed room, a flexible space spanning the first and second floors and built for the extra guests every good gathering brings.',
      'Eight Pullman-style window sleeper beds sleep up to eight, making it the perfect spot for cousins, kids, or a crowd of old friends.',
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

// --- Sleeping Arrangements matrix -------------------------------------------
//
// The source site presents sleeping arrangements as a bed-type matrix: one row
// per room, a column per bed type, numeric counts in the cells. This mirrors
// that structure verbatim (including the "Common Area" label for the
// window-sleeper room, and the Lake room's configurable asterisks). Counts here
// are the table's own figures and are intentionally independent of each room's
// prose `beds` copy above.

/** Bed-type columns, in the order the source table lists them. */
export const bedTypes = ['King', 'Queen', 'Full', 'Twin', 'Window Sleeper'] as const;

export interface SleepingRow {
  /** Label shown in the far-left column. */
  label: string;
  /** Room slug the label links to, when it maps to a room page. */
  slug?: string;
  /** Bed counts keyed by bed type; omitted types render as blank cells. */
  cells: Partial<Record<(typeof bedTypes)[number], string>>;
  /** Value in the Sleeps column (may carry a configurable asterisk). */
  sleeps: string;
}

export const sleepingMatrix: SleepingRow[] = [
  { label: 'Ponderosa', slug: 'ponderosa', cells: { King: '1' }, sleeps: '2' },
  { label: 'Meadow', slug: 'meadow', cells: { Queen: '1', 'Window Sleeper': '1' }, sleeps: '3' },
  { label: 'Little Meadow', slug: 'littlemeadow', cells: { Twin: '2' }, sleeps: '2' },
  { label: 'Hilltop', slug: 'hilltop', cells: { Full: '1', Twin: '1' }, sleeps: '3' },
  { label: 'Lake', slug: 'lake', cells: { King: '1*', Twin: '2*' }, sleeps: '2*' },
  { label: 'Loft', slug: 'loft', cells: { Full: '1' }, sleeps: '2' },
  { label: 'Common Area', slug: 'winbeds', cells: { 'Window Sleeper': '8' }, sleeps: '8' },
];

/** Total guests the house sleeps, as shown in the matrix's Total row. */
export const sleepingTotal = '22';

/** Footnote shown beneath the sleeping matrix. */
export const sleepingFootnote =
  'Lake can be configured as a King or 2 Twins. Default is a King. Please let us know that you want Twins';
