import type { Employee } from "../../../types/admin.types"

interface Props {
  employee: Employee
  onDelete: (id: string) => void
}

const EmployeeCard = ({ employee, onDelete }: Props) => {
  return (
    <div className="flex items-center gap-4 bg-white/4 border border-white/8 rounded-xl px-5 py-4 hover:bg-white/6 transition-colors duration-200">
      <div className="w-11 h-11 shrink-0 rounded-full bg-[#9B2335]/15 flex items-center justify-center">
        <i className="bi bi-person text-[#9B2335] text-lg" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-white text-sm font-medium truncate">{employee.email}</p>
        <p className="text-white/60 text-xs font-mono mt-0.5">
          Alta: {new Date(employee.createdAt).toLocaleDateString("es-AR")}
        </p>
      </div>
      <button
        onClick={() => onDelete(employee._id)}
        aria-label="Dar de baja"
        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-white/40 hover:text-[#9B2335] hover:bg-[#9B2335]/10 transition-colors duration-200 cursor-pointer"
      >
        <i className="bi bi-trash text-base" aria-hidden="true" />
      </button>
    </div>
  )
}

export default EmployeeCard
