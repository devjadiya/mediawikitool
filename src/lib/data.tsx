import { Bot, PenSquare, ScanSearch, ShieldCheck } from 'lucide-react';

export type Tool = {
  href: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
};

export const tools: Tool[] = [
  {
    href: '/suggest-category',
    title: 'Category Suggester',
    description: 'Upload an image and let AI suggest the most relevant Wikimedia Commons categories.',
    category: 'Media',
    icon: <ScanSearch className="h-8 w-8 text-primary" />,
  },
  {
    href: '/generate-caption',
    title: 'Caption Writer',
    description: 'Get help writing a clear, encyclopedic caption for your media submission.',
    category: 'Media',
    icon: <PenSquare className="h-8 w-8 text-primary" />,
  },
  {
    href: '/validate-image',
    title: 'Image Validator',
    description: 'Check your photo against common issues like watermarks before uploading.',
    category: 'Media',
    icon: <Bot className="h-8 w-8 text-primary" />,
  },
  {
    href: '/anonymize-text',
    title: 'Wiki-Anonymizer',
    description: 'Redact Personally Identifiable Information (PII) from text.',
    category: 'Privacy & Security',
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
  },
];
