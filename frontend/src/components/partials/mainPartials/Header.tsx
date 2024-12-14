import { useState } from "react";
import { Link } from "react-router-dom"; // Gunakan Link untuk navigasi
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk menu mobile

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // Fungsi untuk toggle menu
  const closeMenu = () => setIsMenuOpen(false); // Fungsi untuk menutup menu

  // Daftar navigasi
  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Paket Wisata", path: "/tour-package" },
    { name: "Destinasi", path: "/destination" },
    { name: "Profile", path: "/profile" },
    { name: "Artikel", path: "/article" },
  ];

  return (
    <header className="bg-gray-100 shadow-md py-4 fixed w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="/Logo/TerbitTravel_Logo.svg"
            alt="Logo"
            className="w-[50px] h-auto"
          />
          <span className="text-xl font-bold text-primary">
            Travedia Terbit Semesta
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link to="/login">
            <Button variant="outline" className="px-6">
              Masuk
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="default" className="px-6">
              Daftar
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            onClick={toggleMenu}
            className="text-gray-700 hover:text-primary transition-transform duration-300 text-2xl"
          >
            ☰
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-0 left-0 w-full h-screen bg-gray-100 shadow-md z-40 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={closeMenu}
          className="absolute top-4 right-4 text-gray-700 hover:text-primary text-2xl font-bold transition"
        >
          ✕
        </button>

        <div className="flex flex-col items-center justify-center h-full space-y-6">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              onClick={closeMenu} // Tutup menu setelah navigasi
              className="text-gray-700 hover:text-primary text-xl font-medium transition"
            >
              {link.name}
            </Link>
          ))}
          <Link to="/login" onClick={closeMenu}>
            <Button variant="outline" className="px-6">
              Masuk
            </Button>
          </Link>
          <Link to="/register" onClick={closeMenu}>
            <Button variant="default" className="px-6">
              Daftar
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
