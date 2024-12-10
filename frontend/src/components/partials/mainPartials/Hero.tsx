const Hero: React.FC = () => {
    return (
        <div className="container mx-auto pt-28 pb-10 px-5">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-5">
                <div className="text-center lg:text-left z-20">
                    <h1 className="text-2xl lg:text-6xl font-bold mb-4">Selamat Datang di Travedia Terbit Semesta</h1>
                    <p className="text-gray-800 text-lg">Ini adalah deskripsi singkat tentang halaman ini.</p>
                    <div className="md:py-10 py-2">
                        <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg">Mulai Sekarang</button>
                    </div>
                </div>
                
                <div className="mt-8 lg:mt-0">
                    <img 
                        src="src/assets/Banner/banner1.svg" 
                        alt="Logo" 
                        className="w-full max-w-[350px] lg:max-w-[700px] h-auto object-contain"
                    />
                    <img 
                        src="src/assets/Banner/pesawatKertas1.svg" 
                        alt="Logo" 
                        className="absolute top-20 left-20 right-200 max-w-[100px] lg:max-w-[260px] h-auto object-contain"
                    />
                    <img 
                        src="src/assets/Banner/banner2.svg" 
                        alt="Logo" 
                        className="absolute top-30 bottom-40 left-80 right-80 max-w-[100px] lg:max-w-[260px] h-auto object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero;
