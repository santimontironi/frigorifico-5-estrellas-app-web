import { useEffect, useState } from "react"
import UseAdmin from "../../hooks/UseAdmin"
import Loader from "../ui/Loader"
import AddEmployeeModal from "./AddEmployeeModal"
import EmployeeCard from "./EmployeeCard"

const EmployeesAdmin = () => {
  const { employees, fetchEmployees, loading } = UseAdmin()

  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchEmployees()
  }, [])

  return (
    <section className="w-full min-h-full bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] flex flex-col">
      
      <div className="px-6 py-7 md:px-10 md:py-9 border-b border-white/8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <i className="bi bi-people text-[#9B2335] text-xs" aria-hidden="true" />
            <span className="text-white text-xs font-mono uppercase tracking-[0.2em]">Administradores</span>
          </div>
          <h2 className="text-white text-2xl md:text-4xl font-bold tracking-tight">Ver administradores</h2>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 flex items-center gap-2 bg-linear-to-r from-[#9B2335] to-[#7A1C2A] text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-[#B82A40] hover:to-[#9B2335] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <i className="bi bi-plus-lg text-base" aria-hidden="true" />
          Agregar nuevo admin
        </button>
      </div>

      <div className="flex-1 p-6 md:p-10">
        {loading.employees ? (
          <div className="flex items-center justify-center py-24">
            <Loader />
          </div>
        ) : employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 border border-dashed border-white/10 rounded-2xl">
            <i className="bi bi-person-x text-white/25 text-4xl" aria-hidden="true" />
            <p className="text-white/50 text-sm font-mono">No hay administradores todavía</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {employees.map((employee) => (
              <EmployeeCard key={employee._id} employee={employee} />
            ))}
          </div>
        )}
      </div>

      <AddEmployeeModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}

export default EmployeesAdmin
