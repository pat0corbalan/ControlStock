"use client";

import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { ClientesTable } from "@/components/customers/customers-table";
import { ClienteForm } from "@/components/customers/customers-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";

interface Cliente {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at?: string;
}

interface ClienteFormData {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClientes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/customers");
      if (!res.ok) throw new Error("Error al obtener clientes");
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      toast.error((error as Error).message || "Error al cargar los clientes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) =>
      cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
  }, [clientes, searchTerm]);

  const handleAddCliente = async (clienteData: ClienteFormData) => {
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteData),
      });
      if (!res.ok) throw new Error("Error al crear cliente");
      const nuevoCliente: Cliente = await res.json();
      setClientes([...clientes, nuevoCliente]);
      setIsAddDialogOpen(false);
      toast.success("Cliente creado correctamente");
    } catch (error) {
      toast.error((error as Error).message || "Error al crear cliente");
    }
  };

  const handleEditCliente = async (clienteData: ClienteFormData) => {
    if (!editingCliente) return;
    try {
      const res = await fetch(`/api/customers/${editingCliente.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteData),
      });
      if (!res.ok) throw new Error("Error al actualizar cliente");
      const actualizado: Cliente = await res.json();
      setClientes(clientes.map((c) => (c.id === actualizado.id ? actualizado : c)));
      setEditingCliente(null);
      toast.success("Cliente actualizado correctamente");
    } catch (error) {
      toast.error((error as Error).message || "Error al actualizar cliente");
    }
  };

  const handleDeleteCliente = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) return;
    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar cliente");
      setClientes(clientes.filter((c) => c.id !== id));
      toast.success("Cliente eliminado correctamente");
    } catch (error) {
      toast.error((error as Error).message || "Error al eliminar cliente");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 md:ml-64 p-6">
        <h1 className="text-3xl font-bold mb-2">Clientes</h1>
        <p className="text-muted-foreground mb-6">Administra tus clientes registrados</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" /> Agregar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
              </DialogHeader>
              <ClienteForm onSubmit={handleAddCliente} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <p>Cargando clientes...</p>
        ) : (
          <>
            <ClientesTable
              clientes={filteredClientes}
              onEdit={setEditingCliente}
              onDelete={handleDeleteCliente}
            />
            <Dialog open={!!editingCliente} onOpenChange={() => setEditingCliente(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Editar Cliente</DialogTitle>
                </DialogHeader>
                {editingCliente && (
                  <ClienteForm
                    initialData={editingCliente}
                    onSubmit={handleEditCliente}
                    onCancel={() => setEditingCliente(null)}
                  />
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </main>
    </div>
  );
}
