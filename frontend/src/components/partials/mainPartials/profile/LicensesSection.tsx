import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowUpRight } from "lucide-react";

interface License {
  id: number;
  name: string;
  description: string;
  image: string;
  pdfUrl: string;
}

const licenses: License[] = [
  {
    id: 1,
    name: "NPWP",
    description: "Nomor Pokok Wajib Pajak",
    image: "../Profile/Licenses/npwp.png",
    pdfUrl: "../Profile/Licenses/npwp.pdf"
  },
  {
    id: 2,
    name: "NIB",
    description: "Nomor Induk Berusaha",
    image: "../Profile/Licenses/nib.png",
    pdfUrl: "../Profile/Licenses/nib.pdf"
  },
  {
    id: 3,
    name: "Sertifikat Standar",
    description: "Sertifikat Standar KBLI",
    image: "../Profile/Licenses/standar.png",
    pdfUrl: "../Profile/Licenses/standar.pdf"
  },
  {
    id: 4,
    name: "Sertifikat Pendirian",
    description: "Sertifikat Pendirian Perusahaan",
    image: "../Profile/Licenses/company.png",
    pdfUrl: "../Profile/Licenses/company.pdf"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const imageVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const LicenseSection: React.FC = () => {
  const handleLicenseClick = (license: License) => {
    // Buka PDF di tab baru untuk semua ukuran layar
    window.open(license.pdfUrl, '_blank');
  };

  return (
    <section className="py-12 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-[#4A4947]">
            Sertifikasi & Lisensi
          </h2>
          <p className="text-gray-500 mt-4">
            Dokumen resmi perizinan dan legalitas perusahaan kami
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          {licenses.map((license) => (
            <motion.div
              key={license.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 group cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={() => handleLicenseClick(license)}
            >
              <motion.div 
                className="h-32 sm:h-40 mb-4 sm:mb-6 relative overflow-hidden"
                variants={imageVariants}
              >
                <img
                  src={license.image}
                  alt={license.name}
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{license.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{license.description}</p>
                </div>
                <motion.div 
                  className="flex items-center space-x-2 text-primary"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LicenseSection;