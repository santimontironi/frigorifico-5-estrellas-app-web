import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

// Placeholder: dejá caer las imágenes reales en public/images con estos nombres
// (o cambialos acá) y el bloque de color de fallback desaparece solo.
const banners = [
  { src: '/images/banner1.png', alt: 'Banner 1', gradient: 'from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A]' },
  { src: '/images/banner2.jpg', alt: 'Banner 2', gradient: 'from-[#2A0E14] via-[#160709] to-[#0A0A0A]' },
  { src: '/images/banner3.png', alt: 'Banner 3', gradient: 'from-[#2A0E14] via-[#160709] to-[#0A0A0A]' }
]

const ImageCarousel = () => {
  // trackea qué imágenes fallaron (aún no subidas) para mostrar el placeholder
  const [failed, setFailed] = useState<Record<string, boolean>>({})

  return (
    <div className="border-b border-white/8">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        style={{
          '--swiper-pagination-color': '#C9405A',
          '--swiper-pagination-bullet-inactive-color': '#F2EDE6',
          '--swiper-pagination-bullet-inactive-opacity': '0.35',
          '--swiper-pagination-bullet-size': '9px',
        } as React.CSSProperties}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.src}>
            <div className={`relative h-70 md:h-105 xl:h-140 2xl:h-160 w-full overflow-hidden bg-linear-to-br ${banner.gradient}`}>
              {failed[banner.src] ? (
                // Placeholder mientras no exista la imagen real
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                  <i className="bi bi-image text-[#9B2335]/50 text-4xl md:text-5xl" aria-hidden="true" />
                  <span className="text-[#C9BFB5]/50 text-xs tracking-[0.3em] uppercase font-mono">{banner.alt}</span>
                </div>
              ) : (
                <img
                  src={banner.src}
                  alt={banner.alt}
                  className="h-full w-full object-cover"
                  onError={() => setFailed((prev) => ({ ...prev, [banner.src]: true }))}
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ImageCarousel
