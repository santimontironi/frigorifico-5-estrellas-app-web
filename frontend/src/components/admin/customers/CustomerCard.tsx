import Swal from "sweetalert2"
import UseAdmin from "../../../hooks/UseAdmin"
import type { Customer } from "../../../types/admin.types"

interface Props {
  customer: Customer
}

const CustomerCard = ({ customer }: Props) => {
  const { deleteCustomer, loading } = UseAdmin()

  const { street, number, floor, apartment, city, province } = customer.address

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Dar de baja cliente",
      html: `Vas a dar de baja a <strong>${customer.firstName} ${customer.lastName}</strong>.<br/>No podrá volver a iniciar sesión.`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: "#8B1A2F",
      cancelButtonColor: "#8A8078",
      confirmButtonText: "Sí, dar de baja",
      cancelButtonText: "Cancelar",
      background: "#F5F0E8",
      color: "#1A1416",
      iconColor: "#9B2335",
      backdrop: "rgba(15, 5, 7, 0.55)",
      width: 420,
      padding: "2rem 1.5rem",
    })

    if (result.isConfirmed) {
      await deleteCustomer(customer._id)
    }
  }

  const fullAddress = [
    `${street} ${number}`,
    floor ? `Piso ${floor}` : null,
    apartment ? `Depto ${apartment}` : null,
    city,
    province,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <div className="flex items-start gap-4 bg-white/4 border border-white/8 rounded-xl px-5 py-4 hover:bg-white/6 transition-colors duration-200">
      <div className="w-11 h-11 shrink-0 rounded-full bg-[#9B2335]/15 flex items-center justify-center">
        <i className="bi bi-person text-[#9B2335] text-lg" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-white text-sm font-medium truncate">
          {customer.firstName} {customer.lastName}
        </p>

        <div className="mt-1.5 flex flex-col gap-1">
          <p className="text-white/50 text-xs font-mono flex items-center gap-2 truncate">
            <i className="bi bi-envelope text-white/30" aria-hidden="true" />
            {customer.email}
          </p>
          <p className="text-white/50 text-xs font-mono flex items-center gap-2 truncate">
            <i className="bi bi-telephone text-white/30" aria-hidden="true" />
            {customer.phone}
          </p>
          <p className="text-white/50 text-xs font-mono flex items-center gap-2 truncate">
            <i className="bi bi-card-text text-white/30" aria-hidden="true" />
            DNI {customer.dni}
          </p>
          <p className="text-white/50 text-xs font-mono flex items-center gap-2 truncate">
            <i className="bi bi-geo-alt text-white/30" aria-hidden="true" />
            {fullAddress}
          </p>
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end gap-3">
        <span className="text-white/40 text-xs font-mono">
          {new Date(customer.createdAt).toLocaleDateString("es-AR")}
        </span>

        <button
          type="button"
          onClick={handleDelete}
          disabled={loading.deleteCustomer}
          aria-label={`Dar de baja a ${customer.firstName} ${customer.lastName}`}
          title="Dar de baja cliente"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/35 hover:text-[#F2EDE6] hover:bg-[#9B2335]/85 hover:border-[#9B2335] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-300"
        >
          <i className="bi bi-trash3 text-sm" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default CustomerCard
