// Shared site-wide constants for Holliday Lake House.

export const site = {
  name: 'Holliday Lake House',
  tagline: 'A Unique Waterfront Getaway',
  jotformUrl: 'https://form.jotform.com/242805978807067',
  instagramHandle: '@thehollidaylakehouse',
  instagramUrl: 'https://www.instagram.com/thehollidaylakehouse',
  guestGuidelinesPath: '/hlhid2604/',
  // Hero background video hosted on Cloudflare R2 (kept out of the Worker
  // asset bundle). NOTE: this is R2's rate-limited public development URL,
  // intended for testing only — swap for a custom R2 domain before launch.
  heroVideo: 'https://pub-d10ff531b1084493b31ae67c4e509a0b.r2.dev/Landing_Media.mp4',
  heroPoster: '/media/hero-poster.jpg',
  logo: '/media/logo-final.jpg',
  logoIcon: '/media/android-chrome-512x512-2.png',
};

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Contact', href: '/#contact' },
];

// The three feature cards near the top of the home page.
export const featureCards = [
  {
    title: 'Experience',
    image: '/media/features/experience.jpg',
    body: 'Days on the water, evenings by the fire, and the unhurried rhythm of lake life.',
    href: '/#story',
  },
  {
    title: 'Ideas',
    image: '/media/features/ideas.jpg',
    body: 'Family reunions, quiet retreats, milestone celebrations, and every gathering in between.',
    href: '/#story',
  },
  {
    title: 'The Property',
    image: '/media/features/the-property.jpg',
    body: 'Seven bedrooms, room for twenty-two, and acres of lake, meadow, and forest to explore.',
    href: '/#rooms',
  },
];

// Photo-gallery images shown on the home page.
export const galleryImages = [
  { src: '/media/gallery/gallery-01.jpg', alt: 'The veranda overlooking the water' },
  { src: '/media/gallery/gallery-02.jpg', alt: 'Boats on the lake' },
  { src: '/media/gallery/gallery-03.jpg', alt: 'The front door of the house' },
  { src: '/media/gallery/gallery-04.jpg', alt: 'The dining room' },
  { src: '/media/gallery/gallery-05.jpg', alt: 'The kitchen' },
  { src: '/media/gallery/gallery-06.jpg', alt: 'The game room with pool table' },
  { src: '/media/gallery/gallery-07.jpg', alt: 'A great oak on the property' },
  { src: '/media/gallery/gallery-08.jpg', alt: 'Firewood ready by the hearth' },
];
