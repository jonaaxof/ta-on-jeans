import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Fallback slides if DB is empty
const FALLBACK_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?q=80&w=2070&auto=format&fit=crop",
    imgPosition: "center 20%",
    tag: "Coleção Verão 2025",
    title: "O Short Godê Perfeito.",
    subtitle: "A modelagem que valoriza a silhueta brasileira. Cintura super alta e caimento soltinho.",
    link: "/colecao/feminino/shorts",
    ctaPrimary: "Ver Shorts"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=2070&auto=format&fit=crop",
    imgPosition: "center center",
    tag: "Jeans Premium",
    title: "Wide Leg & Mom Jeans.",
    subtitle: "O conforto encontra o estilo. Lavagens exclusivas e tecido 100% algodão.",
    link: "/colecao/feminino/calca",
    ctaPrimary: "Ver Calças"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop",
    imgPosition: "center center",
    tag: "Direto da Fábrica",
    title: "Lucro Garantido.",
    subtitle: "Peças desejo para sua vitrine. Grade completa do 34 ao 46 com envio imediato.",
    link: "/revender",
    ctaPrimary: "Comprar Grade"
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>(FALLBACK_SLIDES);

  // Fetch Banners from Supabase
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('active', true)
          .order('position', { ascending: true });

        if (data && data.length > 0) {
          // Transform DB data to UI format
          const dbSlides = data.map((b: any) => ({
            id: b.id,
            image: b.image_url,
            imgPosition: "center center", // Default
            tag: "Novidade", // Default tag or add field in DB later
            title: b.title || "Oferta Especial",
            subtitle: "Confira as novidades da Tá On Jeans.", // Default subtitle
            link: b.link,
            ctaPrimary: "Confira Agora"
          }));
          setSlides(dbSlides);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
      }
    };
    fetchBanners();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  if (slides.length === 0) return null;

  return (
    // Height: Compact on mobile (480px), Standard E-commerce height on desktop (600px)
    <div className="relative h-[480px] md:h-[600px] w-full overflow-hidden bg-denim-900 group">

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          {/* Image Layer */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={slide.image}
              alt={slide.title}
              style={{ objectPosition: slide.imgPosition }}
              className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${index === currentSlide ? 'scale-105' : 'scale-100' // Reduced zoom effect for better stability
                }`}
            />
            {/* Gradient Overlay - Darker at bottom/left for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-transparent md:to-transparent"></div>
          </div>

          {/* Content Layer */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 md:justify-center md:pb-0 items-center md:items-start text-center md:text-left">
            <div className={`max-w-xl text-white transition-all duration-700 delay-300 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>

              <div className="inline-block bg-leather/90 backdrop-blur-sm px-3 py-1 mb-4 text-xs font-bold uppercase tracking-widest shadow-sm border border-white/10">
                {slide.tag}
              </div>

              <h1 className="text-4xl md:text-6xl font-display font-bold uppercase leading-[0.9] mb-4 tracking-tight drop-shadow-xl text-balance">
                {slide.title}
              </h1>

              <p className="text-base md:text-lg font-light text-gray-100 mb-8 leading-relaxed drop-shadow-md max-w-md mx-auto md:mx-0">
                {slide.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href={slide.link || '#'} className="bg-white text-denim-900 px-8 py-3.5 uppercase font-bold tracking-widest text-sm hover:bg-leather hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg">
                  {slide.ctaPrimary} <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/10 hover:bg-black/40 text-white p-4 backdrop-blur-[2px] transition-all hidden md:block border-r border-white/10"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/10 hover:bg-black/40 text-white p-4 backdrop-blur-[2px] transition-all hidden md:block border-l border-white/10"
      >
        <ChevronRight size={28} />
      </button>

      {/* Pagination Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all duration-500 ${index === currentSlide ? 'w-8 bg-leather' : 'w-2 bg-white/50 hover:bg-white'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
};

export default Hero;