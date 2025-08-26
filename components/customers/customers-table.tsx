import { Button } from "@/components/ui/button";

interface Cliente {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface ClientesTableProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: string) => void;
}

export function ClientesTable({ clientes, onEdit, onDelete }: ClientesTableProps) {
  return (
    <div className="border rounded-md">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted text-left">
            <th className="p-3">Nombre</th>
            <th className="p-3">Teléfono</th>
            <th className="p-3">Email</th>
            <th className="p-3">Dirección</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id} className="border-t">
              <td className="p-3">{cliente.name}</td>
              <td className="p-3">{cliente.phone}</td>
              <td className="p-3">{cliente.email}</td>
              <td className="p-3">{cliente.address}</td>
              <td className="p-3 space-x-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(cliente)}>Editar</Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(cliente.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
