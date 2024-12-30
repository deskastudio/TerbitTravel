'use client'

import { motion } from 'framer-motion'
import { PARTNERS } from '@/lib/constants'

const PartnerSection = () => {
  return (
    <section id="partners" className="py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-[#4A4947]">Partner Kerja Sama</h2>
          <p className="text-gray-500 mt-4">
            Berkolaborasi dengan berbagai mitra terpercaya untuk memberikan solusi terbaik
          </p>
        </motion.div>

        <div className="marquee-container">
          <div className="marquee-content">
            {/* First set */}
            {PARTNERS.map((partner) => (
              <motion.div
                key={partner.id}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="partner-item"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-20 object-contain drop-shadow-md"
                />
              </motion.div>
            ))}
            {/* Duplicate for seamless loop */}
            {PARTNERS.map((partner) => (
              <motion.div
                key={`${partner.id}-duplicate`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="partner-item"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-20 object-contain drop-shadow-md"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .marquee-container {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          position: relative;
        }

        .marquee-content {
          display: flex;
          animation: marquee 15s linear infinite;
          width: max-content;
        }

        .partner-item {
          flex: 0 0 auto;
          width: 12rem;
          padding: 0 0.5rem;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}

export default PartnerSection;