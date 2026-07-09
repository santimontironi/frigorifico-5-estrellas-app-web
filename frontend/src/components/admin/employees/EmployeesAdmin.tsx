import { useEffect, useState } from "react";
import UseAdmin from "../../../hooks/UseAdmin";
import Loader from "../../ui/Loader";
import AddEmployeeModal from "./AddEmployeeModal";
import Swal from "sweetalert2";

const EmployeesAdmin = () => {
  const { employees, fetchEmployees, loading, deleteEmployee } = UseAdmin();

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function handleDelete(id: string) {
    try {
      Swal.fire({
        title: "Dar de baja empleado",
        html: `Vas a dar de baja a un empleado.<br/>No podrá volver a iniciar sesión.`,
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
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteEmployee(id);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="w-full min-h-full bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] flex flex-col">
      <div className="px-6 py-7 md:px-10 md:py-9 border-b border-white/8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <i
              className="bi bi-people text-[#9B2335] text-xs"
              aria-hidden="true"
            />
            <span className="text-white text-xs font-mono uppercase tracking-[0.2em]">
              Administradores
            </span>
          </div>
          <h2 className="text-white text-2xl md:text-4xl font-bold tracking-tight">
            Ver administradores
          </h2>
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
            <i
              className="bi bi-person-x text-white/25 text-4xl"
              aria-hidden="true"
            />
            <p className="text-white/50 text-sm font-mono">
              No hay administradores todavía
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {employees.map((employee) => (
              <div
                key={employee._id}
                className="flex items-center gap-4 bg-white/4 border border-white/8 rounded-xl px-5 py-4 hover:bg-white/6 transition-colors duration-200"
              >
                <div className="w-11 h-11 shrink-0 rounded-full bg-[#9B2335]/15 flex items-center justify-center">
                  <i
                    className="bi bi-person text-[#9B2335] text-lg"
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">
                    {employee.email}
                  </p>
                  <p className="text-white/40 text-xs font-mono mt-0.5">
                    Alta:{" "}
                    {new Date(employee.createdAt).toLocaleDateString("es-AR")}
                  </p>
                </div>
                <span className="shrink-0 text-[#9B2335] text-xs font-mono uppercase tracking-[0.15em] bg-[#9B2335]/10 px-3 py-1 rounded-full">
                  Pedidos
                </span>
                <button
                  onClick={() => handleDelete(employee._id)}
                  aria-label="Dar de baja"
                  className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-white/40 hover:text-[#9B2335] hover:bg-[#9B2335]/10 transition-colors duration-200 cursor-pointer"
                >
                  <i className="bi bi-trash text-base" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddEmployeeModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
};

export default EmployeesAdmin;
