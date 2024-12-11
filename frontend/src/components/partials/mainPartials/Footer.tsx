import { useState } from "react";
import MaintenanceModal from "./MaintananceModal";

const Footer = () => {
  // Data untuk quick links
  const quickLinks = [
    { name: "08130000000", href: "#" },
    { name: "admin@gmail.com", href: "#" },
  ];

  // Data untuk industries
  const industries = [
    { name: "Kebijakan & Privasi", href: "#" },
    { name: "Syarat & Ketentuan", href: "#" },
    { name: "FAQ", href: "#" },
  ];

  // Data untuk social media
  const socialMedia = [
    { name: "Instagram", href: "#", src: "src/assets/Sosmed/instagramIcon.svg" },
    { name: "Facebook", href: "#", src: "src/assets/Sosmed/facebookIcon.svg" },
    { name: "Tiktok", href: "#", src: "src/assets/Sosmed/tiktokIcon.svg" },
    { name: "YouTube", href: "#", src: "src/assets/Sosmed/youtubeIcon.svg" },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal

  const openModal = () => setIsModalOpen(true); // Fungsi untuk membuka modal
  const closeModal = () => setIsModalOpen(false); // Fungsi untuk menutup modal

  return (
    <>
      <footer className="relative bg-gray-100 dark:bg-gray-900">
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
              <div className="flex flex-col mx-auto mt-6 space-y-3 md:space-y-0 md:flex-row">
                <input
                  id="email"
                  type="text"
                  className="px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                  placeholder="Alamat Email"
                />
                <button
                  className="w-full px-6 py-2.5 text-sm font-medium tracking-wider text-white transition-colors duration-300 transform md:w-auto md:mx-4 focus:outline-none bg-gray-800 rounded-lg hover:bg-gray-700 focus:ring focus:ring-gray-300 focus:ring-opacity-80"
                  onClick={openModal}
                >
                  Ikuti
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">
                Kontak Kami
              </p>
              <div className="flex flex-col items-start mt-5 space-y-2">
                {quickLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={openModal}
                    className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Industries */}
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">
                Panduan
              </p>
              <div className="flex flex-col items-start mt-5 space-y-2">
                {industries.map((industry, index) => (
                  <button
                    key={index}
                    onClick={openModal}
                    className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500"
                  >
                    {industry.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-300 md:my-8 dark:border-gray-200" />

          {/* Footer Bottom */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img
                src="/Logo/TerbitTravel_Logo.svg"
                alt="Logo"
                className="w-[50px] h-auto"
              />
              <span className="text-2xl font-bold text-primary">
                Terbit Travel
              </span>
            </div>
            <div className="flex -mx-2">
              {/* Social Media Icons */}
              {socialMedia.map((social, index) => (
                <button
                  key={index}
                  onClick={openModal}
                  className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                  aria-label={social.name}
                >
                  <img src={social.src} alt={social.name} className="w-7 h-7" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Maintenance Modal */}
      {isModalOpen && <MaintenanceModal handleClose={closeModal} />}
    </>
  );
};

export default Footer;
