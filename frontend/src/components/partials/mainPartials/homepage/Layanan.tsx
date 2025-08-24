import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Layanan = () => {
  const categories = [
    { name: "Paket Wisata", image: "../Beranda/Layanan/bromo.jpeg", link: "/paket-wisata" },
    { name: "Destinasi", image: "../Beranda/Layanan/jogja.jpg", link: "/destination" },
  ];

  return (
    <section className="text-center py-8 md:py-16">
      {/* Title */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-[#4A4947]">
          Layanan Kami
        </h2>
        <p className="text-[#4A4947]/70 mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">
          Jelajahi berbagai layanan kami yang dirancang untuk memberikan pengalaman liburan terbaik.
        </p>
      </div>
      
      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-6 px-4">
        {categories.map((category) => (
          <Link key={category.name} to={category.link} className="w-full sm:w-[280px]">
            <Card
              className="
                bg-transparent 
                overflow-hidden 
                transform 
                transition-all 
                duration-300 
                hover:shadow-xl 
                hover:-translate-y-2 
                group
                rounded-2xl
                h-[320px]"
            >
              <CardHeader className="relative w-full overflow-hidden p-0 h-[250px]">
                <div className="w-full h-full overflow-hidden relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="
                      absolute 
                      inset-0 
                      w-full 
                      h-full 
                      object-cover
                      rounded-t-2xl
                      group-hover:scale-110 
                      transition-transform 
                      duration-300"
                  />
                </div>
              </CardHeader>
              <CardTitle
                className="
                  text-xl 
                  font-semibold 
                  text-[#4A4947] 
                  p-4
                  group-hover:text-amber-700
                  transition-colors 
                  duration-300
                  flex
                  items-center
                  justify-center
                  h-[70px]"
              >
                {category.name}
              </CardTitle>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Layanan;