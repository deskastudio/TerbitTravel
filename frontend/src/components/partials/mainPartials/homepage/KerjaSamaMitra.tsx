'use client'

import { motion } from 'framer-motion'

const BUS_PARTNERS = [
  {
    id: 1,
    logo: '../kerja-sama/bluestar.png',
    alt: 'PO Sinar Jaya'
  },
  {
    id: 2,
    logo: '../kerja-sama/drwtrans.png',
    alt: 'PO Rosalia Indah'
  },
  {
    id: 3,
    logo: '../kerja-sama/heksa.png',
    alt: 'PO Haryanto'
  },
  {
    id: 4,
    logo: '../kerja-sama/josal.png',
    alt: 'PO Pahala Kencana'
  },
  {
    id: 5,
    logo: '../kerja-sama/mitrarahayu.png',
    alt: 'PO Kramat Djati'
  },
  {
    id: 6,
    logo: '../kerja-sama/pandawa.png',
    alt: 'PO Harapan Jaya'
  },
  {
    id: 7,
    logo: '../kerja-sama/rm.png',
    alt: 'PO Gunung Harta'
  },
  {
    id: 8,
    logo: '../kerja-sama/tam.png',
    alt: 'PO Lorena'
  },
]

const KerjaSamaMitra = () => {
  return (
    <section id="bus-partners" className="py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-[#4A4947]">Kerja Sama Mitra</h2>
          <p className="text-gray-500 mt-4">
            Berkolaborasi dengan berbagai perusahaan terkemuka di Indonesia
          </p>
        </motion.div>

        <div className="marquee-container">
          <div className="marquee-content">
            {/* Original set */}
            {BUS_PARTNERS.map((partner) => (
              <div 
                key={partner.id}
                className="partner-item"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={partner.logo}
                    alt={partner.alt}
                    className="w-full h-32 object-contain filter drop-shadow-md"
                  />
                </motion.div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {BUS_PARTNERS.map((partner) => (
              <div 
                key={`${partner.id}-duplicate`}
                className="partner-item"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={partner.logo}
                    alt={partner.alt}
                    className="w-full h-32 object-contain filter drop-shadow-md"
                  />
                </motion.div>
              </div>
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
          animation: marquee 20s linear infinite;
          width: max-content;
        }

        .partner-item {
          flex: 0 0 auto;
          width: 20rem;
          margin: 0 1rem;
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

export default KerjaSamaMitra;