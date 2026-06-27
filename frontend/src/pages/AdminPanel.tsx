import { useEffect, useState } from "react"
import useDashboardAdmin from "../hooks/UseDashboardAdmin"
import type { viewDashboardAdmin } from "../types/general.types"
import SideNavAdmin from "../components/SideNavAdmin"
import WelcomeAdmin from "../components/WelcomeAdmin"
import ProductsAdmin from "../components/ProductsAdmin"
import AddProduct from "../components/AddProduct"
import ImportProducts from "../components/ImportProducts"

const AdminPanel = () => {

    const { fetchAdmin, loading } = useDashboardAdmin()
    const [viewAdmin, setViewAdmin] = useState<viewDashboardAdmin>('welcome')

    useEffect(() => {
        fetchAdmin()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-[#9B2335] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen">
            <SideNavAdmin viewAdmin={viewAdmin} setViewAdmin={setViewAdmin} />
            <main className="flex-1 overflow-auto bg-[#010101]">
                {viewAdmin === 'welcome' && <WelcomeAdmin />}
                {viewAdmin === 'products' && <ProductsAdmin />}
                {viewAdmin === 'addProduct' && <AddProduct />}
                {viewAdmin === 'importProducts' && <ImportProducts />}
                {viewAdmin === 'orders' && <div className="text-[#7A6B63]">Pedidos — próximamente</div>}
            </main>
        </div>
    )
}

export default AdminPanel