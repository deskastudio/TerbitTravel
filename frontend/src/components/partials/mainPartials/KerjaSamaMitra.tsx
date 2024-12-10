import { Card, CardHeader } from "@/components/ui/card";

// Import gambar mitra (asumsikan gambar disimpan di folder public/images/mitra)
const mitraImages = [
  { image: "src/assets/Banner/logoMitra1.png" },
  { image: "src/assets/Banner/logoMitra2.png" },
  { image: "src/assets/Banner/logoMitra3.png" },
  { image: "src/assets/Banner/logoMitra4.png" },
  { image: "src/assets/Banner/logoMitra5.png" },
];

const KerjaSamaMitra = () => {
  return (
    <section className="text-center pt-10">
      {/* Title */}
      <h2 className="text-3xl font-bold mb-4">Kerja Sama Mitra</h2>
      <p className="text-gray-600 mb-8 max-w-[600px] mx-auto px-3">
        Kami bangga bermitra dengan perusahaan-perusahaan terkemuka untuk
        memberikan layanan terbaik.
      </p>

      {/* Cards */}
      <div className="flex flex-wrap justify-center">
        {mitraImages.map((mitra, index) => (
          <Card
            key={index}
            className="w-[150px] md:w-[200px] lg:w-[220px] flex flex-col items-center overflow-hidden"
          >
            <CardHeader className="relative w-full">
              {/* Logo Mitra */}
              <img
                src={mitra.image}
                className="object-contain w-full h-[100px] md:h-[120px] lg:h-[140px]"
                style={{ clipPath: "ellipse(50% 45% at 50% 50%)" }}
              />
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default KerjaSamaMitra;
