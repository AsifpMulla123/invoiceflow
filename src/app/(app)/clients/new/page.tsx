import { ClientForm } from "@/components/clients/client-form";

export default function NewClientPage() {
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Add client</h1>
      <ClientForm />
    </div>
  );
}
