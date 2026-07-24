import { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import usePhoto from '../../hooks/usePhoto'

const ImageCarousel = () => {
  
  const { photos, getPhotos } = usePhoto()

  useEffect(() => {
    getPhotos()
  }, [])

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
        {photos.length > 0 ? (
          photos.map((photo) => (
            <SwiperSlide key={photo._id}>
              <div className="relative h-70 md:h-105 xl:h-140 2xl:h-160 w-full overflow-hidden bg-[#0A0A0A]">
                <img
                  src={photo.image}
                  alt="Foto del carrusel"
                  className="h-full w-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))
        ) : (
          // Placeholder mientras el admin no haya subido ninguna foto
          <SwiperSlide>
            <div className="relative h-70 md:h-105 xl:h-140 2xl:h-160 w-full overflow-hidden bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A]">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                <i className="bi bi-image text-[#9B2335]/50 text-4xl md:text-5xl" aria-hidden="true" />
                <span className="text-[#C9BFB5]/50 text-xs tracking-[0.3em] uppercase font-mono">Frigorífico 5 Estrellas</span>
              </div>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  )
}

export default ImageCarousel
