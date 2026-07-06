import { useEffect } from "react"
import Header from "../components/ui/Header"
import ProductCard from "../components/products/ProductCard"
import Loader from "../components/ui/Loader"
import Features from "../components/products/Features"
import DiagonalLines from "../components/ui/DiagonalLines"
import UseProducts from "../hooks/useProducts"

const Home = () => {
  const { products, getProducts, loading } = UseProducts()

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <section className="min-h-screen bg-[#0A0A0A]">
      <Header />

      <div className="relative overflow-hidden border-b border-white/8 bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A]">

        <DiagonalLines />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:px-10 md:py-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-0.5 w-12 bg-[#9B2335] shadow-[0_0_12px_rgba(155,35,53,0.8)]" />
            <span className="text-[#9B2335] text-xs tracking-[0.3em] uppercase font-mono font-semibold">Frigorífico 5 Estrellas</span>
          </div>

          <h1 className="text-[#F2EDE6] text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] max-w-3xl">
            Carnes premium, <span className="text-[#C9405A] [text-shadow:0_0_28px_rgba(155,35,53,0.6)]">directo</span> del frigorífico
          </h1>

          <p className="text-[#C9BFB5]/70 text-base md:text-lg mt-6 max-w-xl leading-relaxed">
            Cortes seleccionados, frescura garantizada y los mejores precios mayoristas. Elegí tus productos, sumalos al carrito y recibilos en casa.
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-4 mt-10">
            <Features icon="bi-snow" label="Frescura garantizada" />
            <Features icon="bi-truck" label="Envío a domicilio" />
            <Features icon="bi-award" label="Cortes premium" />
            <Features icon="bi-cash-coin" label="Precios mayoristas" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:px-10 md:py-16">

        <div className="flex items-end justify-between gap-4 mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <i className="bi bi-shop text-[#9B2335] text-sm" aria-hidden="true" />
              <span className="text-[#C9BFB5] text-xs tracking-[0.3em] uppercase font-mono">Catálogo</span>
            </div>
            <h2 className="text-[#F2EDE6] text-2xl md:text-3xl font-bold tracking-tight">Nuestros productos</h2>
          </div>

          {!loading.get && (
            <span className="shrink-0 text-[#C9BFB5]/50 text-sm font-mono">
              {products?.length ?? 0} productos
            </span>
          )}
        </div>

        {loading.get ? (
          <div className="flex items-center justify-center py-32">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
            {products?.map((product) => (
              <ProductCard
                key={product._id}
                name={product.name}
                category={product.category.name}
                price={product.price}
                unit={product.unit}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Home
