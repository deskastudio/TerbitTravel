export interface Testimonial {
    id: string;
    name: string;
    agency: string;
    description: string;
    uploadDate: string;
    status: 'uploaded' | 'not uploaded';
    displayed: boolean;
  }
  
  export const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'John Doe',
      agency: 'Tech Solutions Inc.',
      description: 'Great service, highly recommended!',
      uploadDate: '2023-06-15',
      status: 'uploaded',
      displayed: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      agency: 'Creative Designs Co.',
      description: 'Excellent work and communication.',
      uploadDate: '2023-06-14',
      status: 'uploaded',
      displayed: false,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      agency: 'Marketing Experts LLC',
      description: 'Outstanding results, will use again!',
      uploadDate: '2023-06-13',
      status: 'not uploaded',
      displayed: false,
    },
    // Add more mock data here...
  ];
  
  