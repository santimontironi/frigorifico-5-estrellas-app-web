import { useState, useEffect } from "react"
import useProfile from "../hooks/UseProfile"
import type { viewDashboardUser } from "../types/general.types"
import SideNavUser from "../components/user/SideNavUser"
import WelcomeUser from "../components/user/WelcomeUser"
import MyProfile from "../components/user/MyProfile"
import MyOrders from "../components/user/MyOrders"

const UserPanel = () => {

  const [viewUser, setViewUser] = useState<viewDashboardUser>('welcome')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { fetchProfile, loading, profile } = useProfile()

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#F7EA79] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <SideNavUser
        profile={profile}
        viewUser={viewUser}
        setViewUser={setViewUser}
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
          <span className="text-white/80 text-sm font-medium tracking-wide">Mi cuenta</span>
        </div>

        <main className="flex-1 overflow-auto bg-[#0A0A0A]">
          {viewUser === 'welcome' && <WelcomeUser name={profile && 'firstName' in profile ? profile.firstName : undefined} />}
          {viewUser === 'myProfile' && <MyProfile />}
          {viewUser === 'myOrders' && <MyOrders />}
        </main>
      </div>

    </div>
  )
}

export default UserPanel
