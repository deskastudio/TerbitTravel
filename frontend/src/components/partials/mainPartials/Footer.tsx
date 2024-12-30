import { useState } from "react";
import { Button } from "@/components/ui/button";
import MaintenanceModal from "./MaintananceModal";

interface QuickLink {
  name: string;
  href: string;
}

interface Industry {
  name: string;
  action: () => void;
}

interface SocialMedia {
  name: string;
  href: string;
  src: string;
}

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const quickLinks: QuickLink[] = [
    { name: "081211565453", href: "tel:081211565453" },
    { 
      name: "travediaterbitsemesta@gmail.com", 
      href: "mailto:travediaterbitsemesta@gmail.com" 
    },
  ];

  const industries: Industry[] = [
    { 
      name: "Kebijakan & Privasi", 
      action: () => setIsModalOpen(true) 
    },
    { 
      name: "Syarat & Ketentuan", 
      action: () => setIsModalOpen(true) 
    },
    { 
      name: "FAQ", 
      action: () => setIsModalOpen(true) 
    },
  ];

  const socialMedia: SocialMedia[] = [
    { 
      name: "Instagram", 
      href: "https://www.instagram.com/terbit.travel/", 
      src: "../src/assets/Sosmed/instagramIcon.svg" 
    },
    { 
      name: "Facebook", 
      href: "https://www.facebook.com/profile.php?id=61559141878271", 
      src: "../src/assets/Sosmed/facebookIcon.svg" 
    },
    // { 
    //   name: "Tiktok", 
    //   href: "https://tiktok.com", 
    //   src: "../src/assets/Sosmed/tiktokIcon.svg" 
    // },
    { 
      name: "YouTube", 
      href: "https://www.youtube.com/@TerbitTravelAndService", 
      src: "../src/assets/Sosmed/youtubeIcon.svg" 
    },
  ];

  const handleSubscribe = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <footer className="relative dark:bg-gray-900">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-10 w-24 h-24 bg-yellow-400 opacity-30 blur-xl rounded-full"></div>
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-pink-400 opacity-30 blur-xl rounded-full"></div>
        <div className="absolute top-1/3 left-1/2 w-16 h-16 bg-blue-400 opacity-30 blur-xl rounded-full transform -translate-x-1/2"></div>

        <div className="container px-6 py-12 mx-auto relative z-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
            {/* Subscription Section */}
            <div className="sm:col-span-2">
              <h1 className="max-w-lg text-xl font-semibold tracking-tight text-gray-800 xl:text-2xl dark:text-white">
                Tetap Terhubung
              </h1>
              <div className="flex flex-col mx-auto mt-6 space-y-3 md:space-y-0 md:flex-row md:items-center">
                <input
                  id="email"
                  type="text"
                  className="px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                  placeholder="Alamat Email"
                />
                <Button 
                  variant="default"
                  className="md:ml-4 bg-amber-700 hover:bg-amber-800 transition-colors duration-300"
                  onClick={handleSubscribe}
                >
                  Ikuti
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">
                Kontak Kami
              </p>
              <div className="flex flex-col items-start mt-5 space-y-2">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Industries - Using buttons for modal triggers */}
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">
                Panduan
              </p>
              <div className="flex flex-col items-start mt-5 space-y-2">
                {industries.map((industry, index) => (
                  <button
                    key={index}
                    onClick={industry.action}
                    className="text-left text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500"
                  >
                    {industry.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-300 md:my-8 dark:border-gray-200" />

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img
                src="/Logo/TerbitTravel_Logo.svg"
                alt="Logo"
                className="w-[50px] h-auto"
              />
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-amber-900 via-red-500 to-yellow-500">
                Travedia Terbit Semesta
              </span>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex items-center justify-center space-x-4 md:space-x-6">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  <img 
                    src={social.src} 
                    alt={social.name} 
                    className="w-6 h-6"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Maintenance Modal */}
      {isModalOpen && <MaintenanceModal handleClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Footer;