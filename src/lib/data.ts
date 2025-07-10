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
  'Microscopy',
  'Astronomy',
  'People in Science',
  'General',
];

export const galleryImages: GalleryImage[] = [
  { id: 1, title: 'Star Trails over a Telescope', author: 'A. Volunteer', src: 'https://placehold.co/400x400.png', alt: 'Star trails over an observatory', category: 'Astronomy', hint: 'star trails' },
  { id: 2, title: 'Crystallized Vitamin C', author: 'B. Scientist', src: 'https://placehold.co/400x400.png', alt: 'Microscopic view of vitamin c crystals', category: 'Microscopy', hint: 'microscopic crystal' },
  { id: 3, title: 'Western Ghats Landscape', author: 'C. Photographer', src: 'https://placehold.co/400x400.png', alt: 'A lush green valley in the Western Ghats', category: 'Nature', hint: 'mountain valley' },
  { id: 4, title: 'Researcher in a Lab', author: 'D. Observer', src: 'https://placehold.co/400x400.png', alt: 'A scientist working with lab equipment', category: 'People in Science', hint: 'scientist lab' },
  { id: 5, title: 'Fractal Patterns in Nature', author: 'E. Artist', src: 'https://placehold.co/400x400.png', alt: 'A leaf showing fractal patterns', category: 'General', hint: 'fractal pattern' },
  { id: 6, title: 'The Andromeda Galaxy', author: 'A. Volunteer', src: 'https://placehold.co/400x400.png', alt: 'A clear shot of the Andromeda Galaxy', category: 'Astronomy', hint: 'andromeda galaxy' },
  { id: 7, title: 'Pollen Grains Under Microscope', author: 'B. Scientist', src: 'https://placehold.co/400x400.png', alt: 'Magnified pollen grains', category: 'Microscopy', hint: 'pollen grains' },
  { id: 8, title: 'Mangrove Forest Roots', author: 'C. Photographer', src: 'https://placehold.co/400x400.png', alt: 'Intertwined roots of a mangrove forest', category: 'Nature', hint: 'mangrove roots' },
];

export type TimelineEvent = {
  year: string;
  event: string;
  description: string;
};

export const timelineEvents: TimelineEvent[] = [
    { year: '2017', event: 'First Edition', description: 'The first Wiki Loves Science competition was held in India, sparking a new wave of scientific contribution.' },
    { year: '2019', event: 'Category Expansion', description: 'New categories were introduced, broadening the scope of submissions to include more fields of science.' },
    { year: '2021', event: 'Record Submissions', description: 'A record number of images were submitted by volunteers across the country.' },
    { year: '2023', event: 'International Recognition', description: 'An Indian submission won a top prize in the international competition, highlighting the quality of local contributions.' },
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
    { id: 1, name: 'Dr. Anya Sharma', role: 'Program Lead', avatar: 'https://placehold.co/100x100.png', bio: 'A passionate biologist and open knowledge advocate, leading the WLS India initiative.', hint: 'woman portrait' },
    { id: 2, name: 'Rohan Verma', role: 'Jury Coordinator', avatar: 'https://placehold.co/100x100.png', bio: 'An experienced photographer and Wikimedia volunteer, ensuring a fair and transparent judging process.', hint: 'man portrait' },
    { id: 3, name: 'Priya Singh', role: 'Community Outreach', avatar: 'https://placehold.co/100x100.png', bio: 'Connects with universities and scientific institutions to encourage participation.', hint: 'woman portrait professional' },
    { id: 4, name: 'Vikram Reddy', role: 'Technical Support', avatar: 'https://placehold.co/100x100.png', bio: 'Manages the technical infrastructure and submission tools for the competition.', hint: 'man portrait professional' },
];
