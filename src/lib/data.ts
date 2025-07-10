export type GalleryImage = {
  id: number;
  title: string;
  author: string;
  src: string;
  alt: string;
  category: string;
  hint: string;
};

export const categories = [
  'Nature',
  'People in science',
  'Microscopy images',
  'Non-photographic media',
  'Image sets',
  'General category',
  'Astronomy',
];

export const galleryImages: GalleryImage[] = [
  { id: 1, title: 'Indian Eagle-Owl', author: 'A. Photographer', src: 'https://placehold.co/400x400.png', alt: 'Indian Eagle-Owl in its natural habitat', category: 'Nature', hint: 'indian eagle owl' },
  { id: 2, title: 'Crystallized Paracetamol', author: 'B. Scientist', src: 'https://placehold.co/400x400.png', alt: 'Microscopic view of paracetamol crystals', category: 'Microscopy images', hint: 'microscopic crystal' },
  { id: 3, title: 'Himalayan Mountain Range', author: 'C. Trekker', src: 'https://placehold.co/400x400.png', alt: 'A panoramic view of the Himalayas', category: 'Nature', hint: 'himalayan mountains' },
  { id: 4, title: 'Researcher at ISRO', author: 'D. Observer', src: 'https://placehold.co/400x400.png', alt: 'A scientist working at the Indian Space Research Organisation', category: 'People in science', hint: 'scientist lab' },
  { id: 5, title: 'Kolam-inspired Fractal', author: 'E. Artist', src: 'https://placehold.co/400x400.png', alt: 'A fractal pattern inspired by traditional Kolam art', category: 'General category', hint: 'fractal pattern' },
  { id: 6, title: 'The Milky Way over Ladakh', author: 'A. Volunteer', src: 'https://placehold.co/400x400.png', alt: 'The Milky Way galaxy visible from a clear night sky in Ladakh', category: 'Astronomy', hint: 'milky way ladakh' },
  { id: 7, title: 'Neem Leaf Cells', author: 'B. Scientist', src: 'https://placehold.co/400x400.png', alt: 'Magnified cells of a neem leaf', category: 'Microscopy images', hint: 'leaf cells' },
  { id: 8, title: 'Sundarbans Mangrove Forest', author: 'C. Photographer', src: 'https://placehold.co/400x400.png', alt: 'Intertwined roots of a mangrove forest in the Sundarbans', category: 'Nature', hint: 'mangrove roots' },
  { id: 9, title: 'Chandrayaan-3 Lander Simulation', author: 'F. Designer', src: 'https://placehold.co/400x400.png', alt: '3D render of the Chandrayaan-3 lander on the moon', category: 'Non-photographic media', hint: 'spacecraft moon' },
  { id: 10, title: 'Monsoon Frog Life Cycle', author: 'G. Biologist', src: 'https://placehold.co/400x400.png', alt: 'Image set showing the life cycle of an Indian monsoon frog', category: 'Image sets', hint: 'frog life cycle' },
];

export type TimelineEvent = {
  year: string;
  event: string;
  description: string;
};

export const timelineEvents: TimelineEvent[] = [
    { year: '2015', event: 'Global Competition Begins', description: 'The first Wiki Science Competition was held in Estonia, and expanded to all of Europe in the fall of 2015.' },
    { year: '2017', event: 'Goes Worldwide', description: 'The competition went worldwide, with dozens of countries participating.' },
    { year: '2019', event: 'Category Expansion', description: 'New categories were introduced, broadening the scope of submissions to include more fields of science.' },
    { year: '2021', event: 'Record Submissions', description: 'A record number of images were submitted by volunteers across the world.' },
    { year: '2025', event: 'India Joins!', description: 'For the first time, India hosts its national Wiki Science Competition from November 1st to December 15th, 2025.' },
];

export type TeamMember = {
    id: number;
    name: string;
    role: string;
    avatar: string;
    bio: string;
    hint: string;
};
  
export const teamMembers: TeamMember[] = [
    { id: 1, name: 'Dr. Anya Sharma', role: 'Program Lead, India', avatar: 'https://placehold.co/100x100.png', bio: 'A passionate biologist and open knowledge advocate.', hint: 'indian woman portrait' },
    { id: 2, name: 'Rohan Verma', role: 'Jury Coordinator', avatar: 'https://placehold.co/100x100.png', bio: 'An experienced photographer and Wikimedia volunteer.', hint: 'indian man portrait' },
    { id: 3, name: 'Priya Singh', role: 'Community Outreach', avatar: 'https://placehold.co/100x100.png', bio: 'Connects with universities and scientific institutions.', hint: 'indian woman professional' },
    { id: 4, name: 'Vikram Reddy', role: 'Technical Support', avatar: 'https://placehold.co/100x100.png', bio: 'Manages the technical infrastructure for the competition.', hint: 'indian man professional' },
];

export type Sponsor = {
  name: string;
  logo: string;
  url: string;
  hint: string;
};

export const sponsors: Sponsor[] = [
    { name: 'Wikimedia India', logo: 'https://placehold.co/150x60.png', url: '#', hint: 'wikimedia india logo' },
    { name: 'Dept. of Science & Technology', logo: 'https://placehold.co/150x60.png', url: '#', hint: 'government of india logo' },
    { name: 'Indian Institute of Science', logo: 'https://placehold.co/150x60.png', url: '#', hint: 'university logo india' },
    { name: 'Infosys Foundation', logo: 'https://placehold.co/150x60.png', url: '#', hint: 'tech foundation logo' },
    { name: 'Photography Society of India', logo: 'https://placehold.co/150x60.png', url: '#', hint: 'photography club logo' },
];
