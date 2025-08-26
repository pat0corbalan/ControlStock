import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ClienteFormProps {
  initialData?: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  onSubmit: (data: { name: string; phone?: string; email?: string; address?: string }) => void;
  onCancel: () => void;
}

export function ClienteForm({ initialData, onSubmit, onCancel }: ClienteFormProps) {
  const [formData, setFormData] = useState(initialData || { name: "", phone: "", email: "", address: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        placeholder="Nombre"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        name="phone"
        placeholder="Teléfono"
        value={formData.phone}
        onChange={handleChange}
      />
      <Input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <Input
        name="address"
        placeholder="Dirección"
        value={formData.address}
        onChange={handleChange}
      />
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
}
