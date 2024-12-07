import { 
  Card, 
  CardHeader, 
  CardTitle 
}  from "@/components/ui/card";

const Categories = () => {
  const categories = [
    { name: "Pyramid", image: "/assets/images/pyramid.jpg" },
    { name: "Mountain", image: "/assets/images/mountain.jpg" },
    { name: "The Mosque", image: "/assets/images/mosque.jpg" },
    { name: "Desert", image: "/assets/images/desert.jpg" },
    { name: "Tower", image: "/assets/images/tower.jpg" },
    { name: "Beach", image: "/assets/images/beach.jpg" },
  ];

  return (
    <section className="text-center py-16 bg-white">
      <h2 className="text-3xl font-bold mb-4">Categories</h2>
      <p className="text-gray-600 mb-8">
        Here are lots of interesting destinations to visit, but don't be confused—they're already grouped by category.
      </p>
      
      <div className="flex flex-wrap justify-center gap-6">
        {categories.map((category) => (
          <Card key={category.name} className="w-32 h-60 bg-gray-100 rounded-lg flex flex-col items-center shadow-lg overflow-hidden">
            <CardHeader className="flex items-center justify-center w-full h-full rounded-t-lg overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="object-cover w-full h-48 rounded-lg"
                style={{ clipPath: 'ellipse(50% 75% at 50% 50%)' }}
              />
            </CardHeader>
            <CardTitle className="mt-4 text-lg font-semibold">{category.name}</CardTitle>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Categories;
