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
  { id: 1, title: 'Star Trails over a Telescope', author: 'A. Volunteer', src: 'https://placehold.co/400x400.png', alt: 'Star trails over an observatory', category: 'Astronomy', hint: 'star trails' },
  { id: 2, title: 'Crystallized Vitamin C', author: 'B. Scientist', src: 'https://placehold.co/400x400.png', alt: 'Microscopic view of vitamin c crystals', category: 'Microscopy images', hint: 'microscopic crystal' },
  { id: 3, title: 'Western Ghats Landscape', author: 'C. Photographer', src: 'https://placehold.co/400x400.png', alt: 'A lush green valley in the Western Ghats', category: 'Nature', hint: 'mountain valley' },
  { id: 4, title: 'Researcher in a Lab', author: 'D. Observer', src: 'https://placehold.co/400x400.png', alt: 'A scientist working with lab equipment', category: 'People in science', hint: 'scientist lab' },
  { id: 5, title: 'Fractal Patterns in Nature', author: 'E. Artist', src: 'https://placehold.co/400x400.png', alt: 'A leaf showing fractal patterns', category: 'General category', hint: 'fractal pattern' },
  { id: 6, title: 'The Andromeda Galaxy', author: 'A. Volunteer', src: 'https://placehold.co/400x400.png', alt: 'A clear shot of the Andromeda Galaxy', category: 'Astronomy', hint: 'andromeda galaxy' },
  { id: 7, title: 'Pollen Grains Under Microscope', author: 'B. Scientist', src: 'https://placehold.co/400x400.png', alt: 'Magnified pollen grains', category: 'Microscopy images', hint: 'pollen grains' },
  { id: 8, title: 'Mangrove Forest Roots', author: 'C. Photographer', src: 'https://placehold.co/400x400.png', alt: 'Intertwined roots of a mangrove forest', category: 'Nature', hint: 'mangrove roots' },
  { id: 9, title: '3D rendering of a protein', author: 'F. Designer', src: 'https://placehold.co/400x400.png', alt: '3D render of a complex protein structure', category: 'Non-photographic media', hint: 'protein render' },
  { id: 10, title: 'Tadpole Development Sequence', author: 'G. Biologist', src: 'https://placehold.co/400x400.png', alt: 'Image set showing tadpole to frog development', category: 'Image sets', hint: 'tadpole development' },
];

export type TimelineEvent = {
  year: string;
  event: string;
  description: string;
};

export const timelineEvents: TimelineEvent[] = [
    { year: '2015', event: 'First Edition', description: 'The first Wiki Science Competition was held in Estonia, and expanded to all of Europe in the fall of 2015.' },
    { year: '2017', event: 'Global Competition', description: 'The competition went worldwide, with dozens of countries participating.' },
    { year: '2019', event: 'Category Expansion', description: 'New categories were introduced, broadening the scope of submissions to include more fields of science.' },
    { year: '2021', event: 'Record Submissions', description: 'A record number of images were submitted by volunteers across the world.' },
    { year: '2025', event: 'Upcoming Competition', description: 'The next iteration of the Wiki Science Competition will take place from November 1st to December 15th, 2025.' },
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
    { id: 1, name: 'Dr. Anya Sharma', role: 'Program Lead, India', avatar: 'https://placehold.co/100x100.png', bio: 'A passionate biologist and open knowledge advocate.', hint: 'woman portrait' },
    { id: 2, name: 'Rohan Verma', role: 'Jury Coordinator', avatar: 'https://placehold.co/100x100.png', bio: 'An experienced photographer and Wikimedia volunteer.', hint: 'man portrait' },
    { id: 3, name: 'Priya Singh', role: 'Community Outreach', avatar: 'https://placehold.co/100x100.png', bio: 'Connects with universities and scientific institutions.', hint: 'woman portrait professional' },
    { id: 4, name: 'Vikram Reddy', role: 'Technical Support', avatar: 'https://placehold.co/100x100.png', bio: 'Manages the technical infrastructure for the competition.', hint: 'man portrait professional' },
];

export type Sponsor = {
  name: string;
  logo: string;
  url: string;
  hint: string;
};

export const sponsors: Sponsor[] = [
    { name: 'Wikimedia Foundation', logo: 'https://placehold.co/150x60.png', url: '#', hint: 'wikimedia foundation logo' },
    { name: 'Science Foundation', logo: 'https://placehold.co/150x60.png', url: '#', hint: 'science foundation logo' },
    { name: 'University of India', logo: 'https://placehold.co/150x60.png', url: '#', hint: 'university logo' },
    { name: 'Tech Corp', logo: 'https://placehold.co/150x60.png', url: '#', hint: 'tech company logo' },
    { name: 'Photo Club India', logo: 'https://placehold.co/150x60.png', url: '#', hint: 'photography club logo' },
];
