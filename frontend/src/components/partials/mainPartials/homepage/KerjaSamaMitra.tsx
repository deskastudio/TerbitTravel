

// Import gambar mitra (asumsikan gambar disimpan di folder public/images/mitra)
// const mitraImages = [
//   { image: "src/assets/Banner/logoMitra1.png" },
//   { image: "src/assets/Banner/logoMitra2.png" },
//   { image: "src/assets/Banner/logoMitra3.png" },
//   { image: "src/assets/Banner/logoMitra4.png" },
//   { image: "src/assets/Banner/logoMitra5.png" },
// ];

const KerjaSamaMitra = () => {
  return (
    <section className="relative py-16 bg-gray-100 text-gray-900">
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30 blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-pink-400 rounded-full opacity-30 blur-xl"></div>
      
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">Kerja Sama Mitra</h2>
        <p className="text-center text-gray-900 mb-8 max-w-[600px] mx-auto">
          Kami bangga bermitra dengan perusahaan-perusahaan terkemuka untuk memberikan layanan terbaik.
        </p>

        {/* <div className="flex flex-wrap justify-center gap-8">
          {mitraImages.map((mitra, index) => (
            <div key={index} className="">
              <img
                src={mitra.image}
                className="object-contain w-32 h-32 mx-auto rounded-full"
                alt={`Mitra ${index}`}
              />
            </div>
          ))}
        </div> */}
        <div>
          <p className="text-center text-gray-900 text-2xl font-bold mb-8 max-w-[600px] mx-auto">  
            Mendatang...
          </p>
        </div>
      </div>
    </section>
  );
};

export default KerjaSamaMitra;
