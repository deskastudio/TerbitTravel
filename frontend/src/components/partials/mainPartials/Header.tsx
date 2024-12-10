import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

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
          <span className="text-2xl font-bold text-primary">Terbit Travel</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <a
            href="/"
            className="text-gray-700 hover:text-primary font-medium transition"
          >
            Beranda
          </a>
          <a
            href="/destinations"
            className="text-gray-700 hover:text-primary font-medium transition"
          >
            Paket Wisata
          </a>
          <a
            href="/contact"
            className="text-gray-700 hover:text-primary font-medium transition"
          >
            Destinasi
          </a>
          <a
            href="/profile"
            className="text-gray-700 hover:text-primary font-medium transition"
          >
            Profile
          </a>
          <a
            href="/article"
            className="text-gray-700 hover:text-primary font-medium transition"
          >
            Artikel
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex space-x-4">
          <Button variant="outline" className="px-6">
            Masuk
          </Button>
          <Button variant="default" className="px-6">
            Daftar
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            onClick={toggleMenu}
            className="text-gray-700 hover:text-primary"
          >
            {isOpen ? "Close" : "Menu"}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-100 text-gray-700 shadow-md py-4">
          <nav className="flex flex-col space-y-4 px-4">
            <a
              href="/"
              className="block font-medium hover:text-primary transition"
            >
              Beranda
            </a>
            <a
              href="/about"
              className="block font-medium hover:text-primary transition"
            >
              Paket Wisata
            </a>
            <a
              href="/contact"
              className="block font-medium hover:text-primary transition"
            >
              Destinasi
            </a>
            <div className="flex flex-col space-y-2 mt-4">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
              <Button variant="default" className="w-full">
                Sign Up
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
