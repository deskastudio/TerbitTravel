import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Ema Watson",
    role: "Marketing Manager at Stech",
    date: "December 10, 2024",
    comment:
      "Timnya sangat profesional dan responsif. Saya sangat merekomendasikan layanan mereka untuk siapa pun yang merencanakan perjalanan yang tak terlupakan.",
  },
  {
    id: 2,
    name: "John Doe",
    role: "Software Engineer at TechCorp",
    date: "November 5, 2024",
    comment:
      "Mereka memperhatikan terhadap detail dan pendekatan yang mengutamakan pelanggan membuat seluruh prosesnya menyenangkan. Benar-benar mitra perjalanan saya!",
  },
  {
    id: 3,
    name: "Jane Smith",
    role: "Product Manager at InnovateX",
    date: "October 22, 2024",
    comment:
      "Setiap aspek dari layanan ini melebihi ekspektasi saya. Saya akan menggunakan layanan mereka lagi untuk petualangan saya berikutnya.",
  },
];

const Review = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="bg-transparent dark:bg-gray-900">
      <div className="max-w-6xl px-6 py-10 mx-auto">
        <p className="text-xl font-medium text-blue-500">Testimoni</p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
          Apa kata Sobat Terbit?
        </h1>

        <main className="relative z-20 w-full mt-8 md:flex md:items-center xl:mt-12">
          <div className="absolute w-full bg-gray-800 -z-10 md:h-96 rounded-2xl"></div>

          {/* Static Image */}
          <div className="w-full p-6 bg-gray-800 md:flex md:items-center rounded-2xl md:bg-transparent md:p-0 lg:px-12 md:justify-evenly">
            <img src="src/assets/Banner/reviewImage.svg" alt="" className="w-1/2"/>

            {/* Dynamic Content */}
            <div className="mt-2 md:mx-6">
              <div>
                <p className="text-xl font-medium tracking-tight text-white">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-blue-200">
                  {testimonials[currentIndex].role}
                </p>
                <p className="text-blue-200 mt-1">
                  {testimonials[currentIndex].date}
                </p>
              </div>

              <p className="mt-4 text-lg leading-relaxed text-white md:text-xl">
                {testimonials[currentIndex].comment}
              </p>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6 md:justify-start">
                <button
                  title="left arrow"
                  onClick={handlePrevious}
                  className="p-2 text-white transition-colors duration-300 border rounded-full rtl:-scale-x-100 hover:bg-blue-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  title="right arrow"
                  onClick={handleNext}
                  className="p-2 text-white transition-colors duration-300 border rounded-full rtl:-scale-x-100 md:mx-6 hover:bg-blue-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Review;
