import { useState } from "react";
import { Button } from "@/components/ui/button";
import MaintenanceModal from "./MaintananceModal"; // Pastikan nama import sudah benar

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk menu mobile

  const openModal = () => setIsModalOpen(true); // Fungsi untuk membuka modal
  const closeModal = () => setIsModalOpen(false); // Fungsi untuk menutup modal
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // Fungsi untuk toggle menu
  const closeMenu = () => setIsMenuOpen(false); // Fungsi untuk menutup menu

  return (
    <>
      <header className="bg-gray-100 shadow-md py-4 fixed w-full z-50">
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/Logo/TerbitTravel_Logo.svg"
              alt="Logo"
              className="w-[50px] h-auto"
            />
            <span className="text-xl font-bold text-primary">Travedia Terbit Semesta</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={openModal}
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              Beranda
            </button>
            <button
              onClick={openModal}
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              Paket Wisata
            </button>
            <button
              onClick={openModal}
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              Destinasi
            </button>
            <button
              onClick={openModal}
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              Profile
            </button>
            <button
              onClick={openModal}
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              Artikel
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex space-x-4">
            <Button variant="outline" className="px-6" onClick={openModal}>
              Masuk
            </Button>
            <Button variant="default" className="px-6" onClick={openModal}>
              Daftar
            </Button>
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
            <button
              onClick={openModal}
              className="text-gray-700 hover:text-primary text-xl font-medium transition"
            >
              Beranda
            </button>
            <button
              onClick={openModal}
              className="text-gray-700 hover:text-primary text-xl font-medium transition"
            >
              Paket Wisata
            </button>
            <button
              onClick={openModal}
              className="text-gray-700 hover:text-primary text-xl font-medium transition"
            >
              Destinasi
            </button>
            <button
              onClick={openModal}
              className="text-gray-700 hover:text-primary text-xl font-medium transition"
            >
              Profile
            </button>
            <button
              onClick={openModal}
              className="text-gray-700 hover:text-primary text-xl font-medium transition"
            >
              Artikel
            </button>
            <Button variant="outline" className="px-6" onClick={openModal}>
              Masuk
            </Button>
            <Button variant="default" className="px-6" onClick={openModal}>
              Daftar
            </Button>
          </div>
        </div>
      </header>

      {/* Maintenance Modal */}
      {isModalOpen && <MaintenanceModal handleClose={closeModal} />}
    </>
  );
};

export default Header;
