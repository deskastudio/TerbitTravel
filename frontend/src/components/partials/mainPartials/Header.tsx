import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MaintenanceModal from "./MaintananceModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface NavLink {
  name: string;
  path: PathType;
}

type PathType = "/" | "/tour-package" | "/destination" | "/profile" | "/article" | "/login" | "/register";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleAuthClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
    closeMenu();
  };

  const navLinks: NavLink[] = [
    { name: "Beranda", path: "/" },
    { name: "Paket Wisata", path: "/tour-package" },
    { name: "Destinasi", path: "/destination" },
    { name: "Profile", path: "/profile" },
    { name: "Artikel", path: "/article" },
  ];

  const isActivePath = (path: PathType): boolean => {
    if (path === "/" && location.pathname !== "/") {
      return false;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="bg-white shadow-md py-4 fixed w-full z-40">
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <img
              src="/Logo/TerbitTravel_Logo.svg"
              alt="Logo"
              className="w-[40px] md:w-[45px] lg:w-[50px] h-auto"
            />
            <span className="font-bold text-base sm:text-lg lg:text-xl bg-clip-text text-transparent bg-gradient-to-r from-amber-900 via-red-500 to-yellow-500">
              Travedia Terbit Semesta
            </span>
          </div>

          {/* Desktop/Tablet Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={`font-medium relative group transition-colors duration-300
                  ${isActivePath(link.path) 
                    ? 'text-amber-800' 
                    : 'text-gray-600 hover:text-amber-800'}`}
              >
                {link.name}
                <span 
                  className={`absolute bottom-[-4px] left-0 w-full h-[2px] 
                    bg-[#B17457] transition-transform duration-300 origin-left
                    ${isActivePath(link.path) 
                      ? 'scale-x-100' 
                      : 'scale-x-0 group-hover:scale-x-100'}`}
                ></span>
              </Link>
            ))}
          </nav>

          {/* Desktop/Tablet Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {/* Avatar component would go here */}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-amber-700 text-amber-700 hover:bg-[#B17457]/10"
                  onClick={handleAuthClick}
                >
                  Masuk
                </Button>
                <Button 
                  className="bg-amber-700 text-white hover:bg-amber-800"
                  onClick={handleAuthClick}
                >
                  Daftar
                </Button>
              </>
            )}
          </div>

          {/* Mobile/Tablet Menu Toggle */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-600 hover:text-amber-800 focus:outline-none p-2"
              type="button"
              aria-label="Toggle menu"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>

          {/* Mobile/Tablet Menu */}
          <div
            className={`fixed inset-0 z-50 
              ${isMenuOpen ? 'visible' : 'invisible'} 
              transition-all duration-500`}
          >
            {/* Overlay with Blur Effect */}
            <div 
              className={`absolute inset-0 bg-black/40 backdrop-blur-sm 
                transition-opacity duration-500 
                ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
              onClick={closeMenu}
            ></div>

            {/* Sliding Menu Panel */}
            <div 
              className={`absolute right-0 top-0 w-[85%] max-w-md h-full 
                bg-white shadow-2xl 
                transform transition-transform duration-500 ease-in-out 
                ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} 
                flex flex-col`}
            >
              {/* Close Button */}
              <div className="p-6 flex justify-end">
                <button 
                  onClick={closeMenu}
                  className="text-gray-600 hover:text-[#B17457] 
                    p-2 rounded-full 
                    transition-colors duration-300 
                    hover:bg-[#B17457]/10"
                  type="button"
                  aria-label="Close menu"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-grow px-6 space-y-6">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    onClick={closeMenu}
                    className={`block text-lg md:text-xl font-medium relative group py-1
                      transition-colors duration-200
                      ${isActivePath(link.path)
                        ? 'text-amber-800'
                        : 'text-gray-600 hover:text-[#B17457]'}`}
                  >
                    {link.name}
                    <span 
                      className={`absolute bottom-0 left-0 w-full h-[2px] 
                        bg-amber-700 transition-transform duration-300 origin-left
                        ${isActivePath(link.path)
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'}`}
                    ></span>
                  </Link>
                ))}
              </nav>

              {/* User Actions */}
              <div className="p-6 border-t border-gray-200">
                {isLoggedIn ? (
                  <div className="flex items-center space-x-4">
                    <Button 
                      onClick={() => setIsLoggedIn(false)}
                      className="w-full bg-amber-700 text-white hover:bg-amber-800"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleAuthClick}
                      className="text-center py-3 
                        border border-amber-700 text-amber-700
                        rounded-lg 
                        hover:bg-[#B17457]/10 
                        transition-colors duration-300"
                    >
                      Masuk
                    </button>
                    <button 
                      onClick={handleAuthClick}
                      className="text-center py-3 
                        bg-amber-700 text-white 
                        rounded-lg 
                        hover:bg-amber-800 
                        transition-colors duration-300"
                    >
                      Daftar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Maintenance Modal */}
      {isModalOpen && <MaintenanceModal handleClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Header;