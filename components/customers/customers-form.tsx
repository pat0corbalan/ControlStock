import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, Home, XCircle, CheckCircle, IdCard } from "lucide-react";

interface ClienteFormProps {
  initialData?: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    dni?: string;
  };
  onSubmit: (data: { name: string; phone?: string; email?: string; address?: string; dni?: string }) => void;
  onCancel: () => void;
}

export function ClienteForm({ initialData, onSubmit, onCancel }: ClienteFormProps) {
  const [formData, setFormData] = useState(
    initialData || { name: "", phone: "", email: "", address: "", dni: "" }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          name="name"
          placeholder="Nombre *"
          value={formData.name}
          onChange={handleChange}
          required
          className="pl-10"
          aria-label="Nombre"
        />
      </div>

      <div className="relative">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          className="pl-10"
          aria-label="Teléfono"
          type="tel"
        />
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="pl-10"
          aria-label="Email"
          type="email"
        />
      </div>

      <div className="relative">
        <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          name="address"
          placeholder="Dirección"
          value={formData.address}
          onChange={handleChange}
          className="pl-10"
          aria-label="Dirección"
        />
      </div>

      <div className="relative">
        <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          name="dni"
          placeholder="DNI"
          value={formData.dni}
          onChange={handleChange}
          className="pl-10"
          aria-label="DNI"
        />
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2"
          aria-label="Cancelar"
        >
          <XCircle size={18} />
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex items-center gap-2"
          aria-label="Guardar cliente"
        >
          <CheckCircle size={18} />
          Guardar
        </Button>
      </div>
    </form>
  );
}
