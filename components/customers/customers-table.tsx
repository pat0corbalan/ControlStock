import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Delete, FileEdit, ChevronLeft, ChevronRight } from "lucide-react";

interface Cliente {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  dni?: string;
}

interface ClientesTableProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: string) => void;
}

const PAGE_SIZE = 3;

export function ClientesTable({ clientes, onEdit, onDelete }: ClientesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(clientes.length / PAGE_SIZE);

  const currentClientes = clientes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="w-full max-w-full">
      <div className="border rounded-lg overflow-x-auto shadow-sm">
        <table
          className="w-full text-left text-sm font-medium text-gray-700"
          role="table"
          aria-label="Tabla de clientes"
        >
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th scope="col" className="p-4">Nombre</th>
              <th scope="col" className="p-4">Teléfono</th>
              <th scope="col" className="p-4">Email</th>
              <th scope="col" className="p-4">Dirección</th>
              <th scope="col" className="p-4">DNI</th>
              <th scope="col" className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentClientes.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No hay clientes para mostrar.
                </td>
              </tr>
            ) : (
              currentClientes.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="border-b hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="p-4">{cliente.name}</td>
                  <td className="p-4">{cliente.phone || "-"}</td>
                  <td className="p-4">{cliente.email || "-"}</td>
                  <td className="p-4">{cliente.address || "-"}</td>
                  <td className="p-4">{cliente.dni || "-"}</td>
                  <td className="p-4 flex justify-center items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(cliente)}
                      aria-label={`Editar cliente ${cliente.name}`}
                      className="flex items-center gap-1"
                    >
                      <FileEdit size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(cliente.id)}
                      aria-label={`Eliminar cliente ${cliente.name}`}
                      className="flex items-center gap-1"
                    >
                      <Delete size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-3 mt-4 text-gray-600">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            aria-label="Página anterior"
            className="flex items-center gap-1"
          >
            <ChevronLeft size={18} />
            Anterior
          </Button>
          <span className="text-sm select-none">
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            aria-label="Página siguiente"
            className="flex items-center gap-1"
          >
            Siguiente
            <ChevronRight size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
