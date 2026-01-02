import React, { useState, useEffect } from "react";

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Discover Your Next Favorite Book",
      subtitle:
        "From timeless classics to modern bestsellers, find stories that inspire.",
      image:
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&h=600&fit=crop&crop=center",
      cta: "Explore Collection",
    },
    {
      id: 2,
      title: "Quality Books at Amazing Prices",
      subtitle:
        "Pre-loved books in excellent condition, ready for their next adventure.",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop&crop=center",
      cta: "Shop Now",
    },
    {
      id: 3,
      title: "Join Our Reading Community",
      subtitle:
        "Connect with fellow book lovers and discover hidden literary gems.",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=600&fit=crop&crop=center",
      cta: "Learn More",
    },
  ];

  // Auto slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden rounded-2xl shadow-2xl mb-12 mt-6">
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            idx === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>

          <div className="relative h-full flex items-center justify-center text-center px-6">
            <div className="max-w-4xl mx-auto">
              <h1
                className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transform transition-all duration-1000 ${
                  idx === current
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                {slide.title}
              </h1>
              <p
                className={`text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto transform transition-all duration-1000 delay-300 ${
                  idx === current
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                {slide.subtitle}
              </p>
              <button
                className={`bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-8 py-4 rounded-full hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl transform transition-all duration-1000 delay-500 ${
                  idx === current
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                {slide.cta}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-10"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-10"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 ${
              idx === current
                ? "w-8 h-3 bg-white rounded-full"
                : "w-3 h-3 bg-white/50 rounded-full hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
