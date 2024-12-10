import React, { useState } from "react";

const MaintenanceModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true); // Set modal to open by default

    const handleClose = () => {
        setIsOpen(false); // Close the modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90">
            <div className="relative flex flex-col items-center justify-center text-center text-white max-w-4xl px-6">
                {/* Maintenance Icon */}
                <div className="mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-20 h-20 text-blue-500 animate-pulse"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8c-3.31 0-6 2.69-6 6m0 0a6 6 0 006 6m0 0c3.31 0 6-2.69 6-6m0 0a6 6 0 00-6-6m0 0V4m0 4a6 6 0 110 12 6 6 0 010-12z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v4m-4 4a4 4 0 118 0"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                    Website ini masih dalam Maintenance
                </h1>

                {/* Description */}
                <p className="text-lg text-gray-300 max-w-xl mb-8">
                    Kami sedang melakukan perbaikan dan pembaruan untuk memberikan pengalaman terbaik. 
                    Harap kembali lagi nanti. Terima kasih atas pengertiannya.
                </p>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
};

export default MaintenanceModal;
