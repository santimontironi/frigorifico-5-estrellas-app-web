import { useEffect, useState } from "react"
import Header from "../../components/ui/Header"
import ProductCard from "../../components/products/ProductCard"
import Loader from "../../components/ui/Loader"
import DiagonalLines from "../../components/ui/DiagonalLines"
import HeroFeatures from "../../components/ui/HeroFeatures"
import OffersHome from "../../components/ui/OffersHome"
import FormSearch from "../../components/ui/FormSearch"
import UseProducts from "../../hooks/useProducts"
import useOffer from "../../hooks/useOffer"
import useCart from "../../hooks/useCart"

const PAGE_SIZE = 12

const Home = () => {
  const { products, productsFiltered, searchProducts, getProducts, loading } = UseProducts()
  const { addToCart } = useCart()

  const { offers } = useOffer()

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [query, setQuery] = useState("")

  useEffect(() => {
    getProducts()
  }, [])

  useEffect(() => { //se pone en un useEffect porque puede que se busque algo mientras se cargan los productos o se modifique el array de productos
    searchProducts(query)
  }, [query, products])

  const isSearching = query.trim().length > 0

  const offerProductsIds = new Set(offers.map(offer => offer.product._id)) //se arma un array con los id de los productos de las ofertas

  const catalog = (isSearching ? productsFiltered : products ).filter(product => !offerProductsIds.has(product._id)) //se filtran los productos de las ofertas

  const total = catalog.length
  const visibleProducts = isSearching ? catalog : catalog.slice(0, visibleCount)
  const hasMore = !isSearching && total > visibleCount

  return (
    <section className="min-h-screen bg-[#0A0A0A]">
      <Header />

      <div className="relative overflow-hidden border-b border-white/8 bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A]">

        <DiagonalLines />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-75 h-75 md:w-140 md:h-140 rounded-full bg-[#9B2335]/20 blur-[60px] md:blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 md:py-28 flex flex-col items-center text-center">

          <img
            src="/images/logo2.png"
            alt="Frigorífico 5 Estrellas"
            className="w-36 md:w-52 h-auto mb-8 drop-shadow-[0_0_40px_rgba(155,35,53,0.5)]"
          />

          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-0.5 w-8 sm:w-12 bg-[#9B2335] shadow-[0_0_12px_rgba(155,35,53,0.8)]" />
            <span className="text-white text-base sm:text-xl md:text-2xl tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.28em] uppercase font-mono font-bold">Frigorífico <span className="text-[#C9405A] lowercase [text-shadow:0_0_20px_rgba(201,64,90,0.55)]">5 Estrellas</span></span>
            <span className="h-0.5 w-8 sm:w-12 bg-[#9B2335] shadow-[0_0_12px_rgba(155,35,53,0.8)]" />
          </div>

          <h1 className="text-[#F2EDE6] text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] max-w-3xl mx-auto">
            Carnes premium, <span className="text-[#C9405A] [text-shadow:0_0_28px_rgba(155,35,53,0.6)]">directo</span> del frigorífico
          </h1>

          <p className="text-[#C9BFB5]/70 text-base md:text-lg mt-6 max-w-xl mx-auto leading-relaxed">
            Cortes seleccionados, frescura garantizada y los mejores precios mayoristas. Elegí tus productos, sumalos al carrito y recibilos en casa.
          </p>

          <a
            href="#catalogo"
            className="group inline-flex items-center gap-2.5 mt-10 bg-linear-to-r from-[#9B2335] to-[#7A1C2A] text-white text-sm font-bold tracking-[0.12em] uppercase px-8 py-4 rounded-full shadow-lg shadow-[#9B2335]/30 hover:shadow-xl hover:from-[#B82A40] hover:to-[#9B2335] active:scale-[0.98] transition-all duration-200"
          >
            Ver catálogo
            <i className="bi bi-arrow-down-short text-lg group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
          </a>

          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 mt-14">
            <HeroFeatures icon="bi-snow" label="Frescura garantizada" />
            <HeroFeatures icon="bi-truck" label="Envío a domicilio" />
            <HeroFeatures icon="bi-award" label="Cortes premium" />
            <HeroFeatures icon="bi-cash-coin" label="Precios mayoristas" />
          </div>
        </div>
      </div>

      <OffersHome />

      <div className="scroll-mt-20 max-w-7xl mx-auto px-6 py-12 md:px-10 md:py-16" id="catalogo">

        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-3">
            <i className="bi bi-shop text-[#9B2335] text-sm" aria-hidden="true" />
            <span className="text-[#C9BFB5] text-xs tracking-[0.3em] uppercase font-mono">Catálogo</span>
          </div>
          <h2 className="text-[#F2EDE6] text-2xl md:text-3xl font-bold tracking-tight">Nuestros productos</h2>

          <div className="mt-6">
            <FormSearch value={query} onChange={setQuery} />
          </div>
        </div>

        {loading.get ? (
          <div className="flex items-center justify-center py-32">
            <Loader />
          </div>
        ) : isSearching && visibleProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <i className="bi bi-search text-[#9B2335]/60 text-4xl mb-4" aria-hidden="true" />
            <p className="text-[#F2EDE6] text-lg font-semibold">Sin resultados</p>
            <p className="text-[#C9BFB5]/60 text-sm mt-1">
              No encontramos productos para "{query}"
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={(product) => addToCart(product, 1)}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-12 md:mt-16">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="group inline-flex items-center gap-2.5 border border-[#9B2335]/60 text-[#F2EDE6] text-sm font-bold uppercase px-5 py-2 rounded-full hover:bg-[#9B2335] hover:border-[#9B2335] hover:shadow-lg hover:shadow-[#9B2335]/30 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  Ver más productos
                  <i className="bi bi-arrow-down-circle text-lg group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default Home
