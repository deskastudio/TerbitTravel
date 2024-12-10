const Footer = () => {
    // Data untuk quick links
    const quickLinks = [
      { name: "081316195586", href: "#" },
      { name: "pakusera@gmail.com", href: "#" },
    ];
  
    // Data untuk industries
    const industries = [
      { name: "Kebijakan & Privasi", href: "#" },
      { name: "Syarat & Ketentuan", href: "#" },
      { name: "FAQ", href: "#" },
    ];
  
    // Data untuk social media
    const socialMedia = [
      { name: "Reddit", href: "#", src: "src/assets/Sosmed/instagramIcon.svg" },
      { name: "Facebook", href: "#", src: "src/assets/Sosmed/facebookIcon.svg" },
      { name: "Github", href: "#", src: "src/assets/Sosmed/tiktokIcon.svg" },
      { name: "Github", href: "#", src: "src/assets/Sosmed/youtubeIcon.svg" },
    ];
  
    return (
      <footer className="bg-transparent dark:bg-gray-900">
        <div className="container px-6 py-12 mx-auto">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
            {/* Subscription Section */}
            <div className="sm:col-span-2">
              <h1 className="max-w-lg text-xl font-semibold tracking-tight text-gray-800 xl:text-2xl dark:text-white">
                Mendatang.
              </h1>
              <div className="flex flex-col mx-auto mt-6 space-y-3 md:space-y-0 md:flex-row">
                <input
                  id="email"
                  type="text"
                  className="px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                  placeholder="Alamat Email"
                />
                <button className="w-full px-6 py-2.5 text-sm font-medium tracking-wider text-white transition-colors duration-300 transform md:w-auto md:mx-4 focus:outline-none bg-gray-800 rounded-lg hover:bg-gray-700 focus:ring focus:ring-gray-300 focus:ring-opacity-80">
                  Ikuti
                </button>
              </div>
            </div>
  
            {/* Quick Links */}
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">Kontak Kami</p>
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
  
            {/* Industries */}
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">Panduan</p>
              <div className="flex flex-col items-start mt-5 space-y-2">
                {industries.map((industry, index) => (
                  <a
                    key={index}
                    href={industry.href}
                    className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500"
                  >
                    {industry.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
  
          <hr className="my-6 border-gray-200 md:my-8 dark:border-gray-700" />
  
          {/* Footer Bottom */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img
                src="/Logo/TerbitTravel_Logo.svg"
                alt="Logo"
                className="w-[50px] h-auto"
              />
              <span className="text-2xl font-bold text-primary">Terbit Travel</span>
            </div>
            <div className="flex -mx-2">
              {/* Social Media Icons */}
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                  aria-label={social.name}
                >
                  <img
                    src={social.src}
                    alt={social.name}
                    className="w-7 h-7"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  