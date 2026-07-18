import { useEffect, useState } from "react"
import useProfile from "../../hooks/UseProfile"
import UseAuth from "../../hooks/UseAuth"
import type { viewDashboardAdmin } from "../../types/general.types"
import SideNavAdmin from "../../components/admin/layout/SideNavAdmin"
import WelcomeAdmin from "../../components/admin/layout/WelcomeAdmin"
import ProductsAdmin from "../../components/admin/products/ProductsAdmin"
import ImportProducts from "../../components/admin/products/ImportProducts"
import Categories from "../../components/admin/categories/Categories"
import EmployeesAdmin from "../../components/admin/employees/EmployeesAdmin"
import AllOffers from "../../components/admin/offers/AllOffers"
import AllOrders from "../../components/admin/orders/AllOrders"
import Customers from "../../components/admin/customers/Customers"

const AdminPanel = () => {

    const { fetchProfile, loading } = useProfile()
    const { isEmployee } = UseAuth()
    // El empleado solo gestiona pedidos, así que arranca directamente en esa vista
    const [viewAdmin, setViewAdmin] = useState<viewDashboardAdmin>(isEmployee ? 'orders' : 'welcome')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        fetchProfile()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#9B2335] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex h-screen">

            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <SideNavAdmin
                viewAdmin={viewAdmin}
                setViewAdmin={setViewAdmin}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0">

                <div className="md:hidden flex items-center gap-4 px-4 h-14 bg-[#121212] border-b border-white/10 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-white/60 hover:text-white transition-colors cursor-pointer"
                        aria-label="Abrir menú"
                    >
                        <i className="bi bi-list text-2xl" />
                    </button>
                    <span className="text-white/80 text-sm font-medium tracking-wide">Panel admin</span>
                </div>

                <main className="flex-1 overflow-auto bg-[#0A0A0A]">
                    {viewAdmin === 'welcome' && <WelcomeAdmin setViewAdmin={setViewAdmin} />}
                    {viewAdmin === 'products' && <ProductsAdmin />}
                    {viewAdmin === 'importProducts' && <ImportProducts />}
                    {viewAdmin === 'categories' && <Categories />}
                    {viewAdmin === 'offers' && <AllOffers />}
                    {viewAdmin === 'orders' && <AllOrders />}
                    {viewAdmin === 'employees' && <EmployeesAdmin />}
                    {viewAdmin === 'customers' && <Customers />}
                </main>
            </div>

        </div>
    )
}

export default AdminPanel