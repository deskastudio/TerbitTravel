import { useState } from "react";
import MaintenanceModal from "../MaintananceModal";

const Hero: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal

  const openModal = () => setIsModalOpen(true); // Fungsi untuk membuka modal
  const closeModal = () => setIsModalOpen(false); // Fungsi untuk menutup modal
    return (
        <>
        <div className="relative bg-gray-100">
            <div className="container mx-auto pt-28 pb-10 px-5 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
                    {/* Text Section */}
                    <div className="text-center lg:text-left z-20">
                        <h1 className="text-3xl lg:text-6xl font-bold mb-4 leading-tight">
                            Selamat Datang di <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500">
                                Travedia Terbit Semesta
                            </span>
                        </h1>
                        <p className="text-gray-700 text-lg lg:text-xl max-w-lg">
                            Temukan destinasi terbaik untuk liburan Anda dan nikmati pengalaman tak terlupakan bersama kami.
                        </p>
                        <div className="md:py-10 py-4">
                            <button className="mt-4 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg shadow-lg transition-all duration-300" onClick={openModal}>
                                Jelajahi Sekarang
                            </button>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="relative mt-8 lg:mt-0">
                        <img
                            src="src/assets/Banner/banner1.svg"
                            alt="Banner Utama"
                            className="w-full max-w-[350px] lg:max-w-[700px] h-auto object-contain transform hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30 blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-400 rounded-full opacity-30 blur-xl"></div>
                <div className="absolute bottom-20 left-40 w-24 h-24 bg-blue-400 rounded-full opacity-30 blur-xl"></div>
            </div>
        </div>

        {/* Maintenance Modal */}
      {isModalOpen && <MaintenanceModal handleClose={closeModal} />}
        </>
    );
};

export default Hero;
