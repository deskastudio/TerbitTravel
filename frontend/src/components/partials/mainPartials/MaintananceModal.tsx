import React, { useState, useEffect } from "react";

interface MaintenanceModalProps {
  handleClose: () => void;
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ handleClose }) => {
  const [isVisible, setIsVisible] = useState(false); // State untuk transisi

  // Mengatur state `isVisible` untuk animasi muncul
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50); // Sedikit delay agar transisi terlihat
    return () => clearTimeout(timer);
  }, []);

  // Fungsi untuk menutup modal dengan animasi
  const closeWithAnimation = () => {
    setIsVisible(false); // Set animasi hilang
    setTimeout(() => {
      handleClose(); // Panggil fungsi handleClose setelah animasi selesai
    }, 300); // Durasi transisi sama dengan CSS
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative flex flex-col items-center justify-center text-center text-white max-w-4xl px-6 transform transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        <div className="mb-6">
          <img
            src="../Sosmed/MaintananceIcon.svg"
            alt="Maintenance Icon"
            className="w-20"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
          Website ini masih dalam Maintenance
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mb-8">
          Kami sedang melakukan perbaikan dan pembaruan untuk memberikan
          pengalaman terbaik. Harap kembali lagi nanti. Terima kasih atas
          pengertiannya.
        </p>
        <button
          onClick={closeWithAnimation}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default MaintenanceModal;
