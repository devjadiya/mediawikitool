import { Bot, PenSquare, ScanSearch, ShieldCheck, Languages, FileText, Code, BookCopy, FileSearch, Sparkles, Wand2, ShieldQuestion, Shield } from 'lucide-react';

export type Tool = {
  href: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
};

export const tools: Tool[] = [
  // Media Tools
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
    href: '/suggest-license',
    title: 'License Suggester',
    description: 'Suggest appropriate content licenses for your uploaded image.',
    category: 'Media',
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
  },
  // Content & Editing Tools
  {
    href: '/fact-checker',
    title: 'Fact Checker',
    description: 'Verify claims in an article against reliable sources.',
    category: 'Content',
    icon: <ShieldQuestion className="h-8 w-8 text-primary" />,
  },
  {
    href: '/translate-text',
    title: 'Translation Assistant',
    description: 'Translate wikitext between languages while preserving markup.',
    category: 'Content',
    icon: <Languages className="h-8 w-8 text-primary" />,
  },
  {
    href: '/find-citations',
    title: 'Citation Finder',
    description: 'Find reliable sources for statements and format citations.',
    category: 'Content',
    icon: <FileSearch className="h-8 w-8 text-primary" />,
  },
  {
    href: '/expand-stub',
    title: 'Article Stub Expander',
    description: 'Generate suggestions to expand short articles and stubs.',
    category: 'Content',
    icon: <Sparkles className="h-8 w-8 text-primary" />,
  },
  {
    href: '/draft-article',
    title: 'Drafting Assistant',
    description: 'Generate a short, sourced draft article on a topic.',
    category: 'Content',
    icon: <FileText className="h-8 w-8 text-primary" />,
  },
  // Privacy & Security Tools
   {
    href: '/code-guardian',
    title: 'Code Guardian',
    description: 'Analyze MediaWiki JS/Lua for security, performance, and best practices.',
    category: 'Privacy & Security',
    icon: <Shield className="h-8 w-8 text-primary" />,
  },
  {
    href: '/anonymize-text',
    title: 'Wiki-Anonymizer',
    description: 'Redact Personally Identifiable Information (PII) from text.',
    category: 'Privacy & Security',
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
  },
  {
    href: '/detect-copyvio',
    title: 'Copyvio Detector',
    description: 'Check if a piece of text is likely a copyright violation.',
    category: 'Privacy & Security',
    icon: <BookCopy className="h-8 w-8 text-primary" />,
  },
  // Development Tools
  {
    href: '/debug-regex',
    title: 'Regex Debugger',
    description: 'Get a natural language explanation of a regular expression.',
    category: 'Development',
    icon: <Code className="h-8 w-8 text-primary" />,
  },
  {
    href: '/explain-code',
    title: 'Code Explainer',
    description: 'Explain a snippet of Lua or JS code used in Wikimedia projects.',
    category: 'Development',
    icon: <Wand2 className="h-8 w-8 text-primary" />,
  },
];
