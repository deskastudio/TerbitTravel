export interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    bio: string;
    social: {
      linkedin?: string;
      twitter?: string;
      email?: string;
    };
  }
  
  export interface Slide {
    image: string;
    alt: string;
    title: string;
    description: string;
  }
  
  export interface Partner {
    id: string;
    name: string;
    logo: string;
    type: 'technology' | 'strategic' | 'solution';
  }
  
  export interface AboutContent {
    title: string;
    content: string;
    image: string;
    highlights: string[];
  }