import { 
  Card, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const Layanan = () => {
  const categories = [
    { name: "Beach", image: "src/assets/Banner/gambar1.jpg" },
    { name: "Desert", image: "src/assets/Banner/gambar2.jpg" },
    { name: "Mountain", image: "src/assets/Banner/gambar3.jpg" },
    { name: "Temple", image: "src/assets/Banner/gambar4.jpg" },
  ];

  return (
    <section className="text-center py-16">
      {/* Title */}
      <h2 className="text-3xl font-bold mb-4">Layanan Kami</h2>
      <p className="text-gray-600 mb-8 mx-5">
        Jelajahi berbagai layanan kami yang dirancang untuk memberikan pengalaman liburan terbaik.
      </p>
      
      {/* Cards */}
      <div className="flex flex-wrap justify-center">
        {categories.map((category) => (
          <Card
            key={category.name}
            className="w-[150px] md:w-[200px] lg:w-[220px] flex flex-col items-center overflow-hidden bg-gray-100"
          >
            <CardHeader className="relative w-full">
              {/* Image with Ellipse Shape */}
              <img
                src={category.image}
                alt={category.name}
                className="object-cover w-full h-[150px] md:h-[180px] lg:h-[200px]"
                style={{ clipPath: 'ellipse(50% 45% at 50% 50%)' }}
              />
            </CardHeader>
            <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Layanan;
