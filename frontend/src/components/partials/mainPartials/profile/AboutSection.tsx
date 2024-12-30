'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ABOUT_CONTENT } from '@/lib/constants';
import { Info } from 'lucide-react';

interface AboutItem {
  title: string;
  content: string;
}

interface TruncatedTextProps {
  text: string;
  limit: number;
  isExpanded: boolean;
}

interface ExpandedItems {
  [key: string]: boolean;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ text, limit, isExpanded }) => {
  const words = text.split(' ');
  if (isExpanded || words.length <= limit) return text;
  return `${words.slice(0, limit).join(' ')}...`;
};

const AboutSection: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<ExpandedItems>({});

  useEffect(() => {
    const checkScreenSize = (): void => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleExpand = (title: string): void => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <section id="about">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-[#4A4947]">
            Tentang Terbit Travel
          </h2>
          <p className="text-gray-500 mt-4">
            Temukan lebih banyak tentang layanan dan keunggulan kami dalam memberikan solusi terbaik untuk Anda.
          </p>
        </motion.div>

        {/* Tabs Component */}
        <Tabs defaultValue={ABOUT_CONTENT[0]?.title.toLowerCase()} className="flex flex-col lg:flex-row gap-12">
          {/* Left Side - Tab Triggers */}
          <div className="lg:w-1/3">
            <TabsList className="flex flex-col w-full space-y-4 bg-transparent h-auto">
              {ABOUT_CONTENT.map((item: AboutItem) => (
                <TabsTrigger
                  key={item.title}
                  value={item.title.toLowerCase()}
                  className="w-full p-4 rounded-2xl bg-white shadow-sm border border-gray-100 hover:border-[#B17457]/20 transition-all data-[state=active]:bg-white data-[state=active]:shadow-md group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-[#B17457]/10">
                      <Info className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-lg text-gray-800">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Klik untuk melihat detail
                      </p>
                    </div>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Right Side - Content */}
          <div className="lg:w-2/3">
            {ABOUT_CONTENT.map((item: AboutItem) => (
              <TabsContent 
                key={item.title} 
                value={item.title.toLowerCase()}
                className="mt-0 outline-none ring-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-0 shadow-lg bg-white rounded-2xl">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        {item.title}
                      </h3>
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-600 leading-relaxed text-justify">
                          <TruncatedText 
                            text={item.content} 
                            limit={25} 
                            isExpanded={!isMobile || expandedItems[item.title]}
                          />
                        </p>
                        {isMobile && item.content.split(' ').length > 25 && (
                          <button 
                            type="button"
                            className="text-amber-700 font-medium mt-2 hover:text-amber-800 transition-colors"
                            onClick={() => toggleExpand(item.title)}
                          >
                            {expandedItems[item.title] ? 'Tutup' : 'Baca selengkapnya'}
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default AboutSection;