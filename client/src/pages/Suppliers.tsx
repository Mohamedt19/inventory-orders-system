import { useEffect, useState, type FormEvent } from "react";
import { apiRequest } from "../lib/api";
import type { Supplier } from "../types";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  async function loadSuppliers() {
    try {
      const data = await apiRequest<Supplier[]>("/api/suppliers");
      setSuppliers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load suppliers");
    }
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      const newSupplier = await apiRequest<Supplier>("/api/suppliers", {
        method: "POST",
        body: JSON.stringify({ name, email, phone }),
      });

      setSuppliers((prev) => [newSupplier, ...prev]);
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create supplier");
    }
  }

  async function handleDelete(supplierId: number) {
    try {
      await apiRequest(`/api/suppliers/${supplierId}`, {
        method: "DELETE",
      });

      setSuppliers((prev) => prev.filter((s) => s.id !== supplierId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete supplier");
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Supplier Entry
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Suppliers
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage vendor records, contact details, and supplier coverage.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 px-5 py-5 md:grid-cols-3"
        >
          <input
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Supplier name"
          />

          <input
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="supplier@example.com"
          />

          <input
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
          />

          <div className="border-t border-slate-200 pt-4 md:col-span-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              Add Supplier
            </button>
          </div>
        </form>

        {error && (
          <div className="px-5 pb-5">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Supplier Register
          </h2>

          <div className="text-sm text-slate-500">
            {suppliers.length} supplier{suppliers.length === 1 ? "" : "s"}
          </div>
        </div>

        {suppliers.length === 0 ? (
          <div className="px-5 py-8 text-sm text-slate-500">
            No suppliers yet.
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="grid grid-cols-[1.5fr_1.8fr_1.2fr_120px] bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <div>Supplier</div>
              <div>Email</div>
              <div>Phone</div>
              <div className="text-center">Actions</div>
            </div>

            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="grid grid-cols-[1.5fr_1.8fr_1.2fr_120px] items-center border-t border-slate-200 px-5 py-3 text-sm"
              >
                <div className="font-semibold text-slate-900">
                  {supplier.name}
                </div>

                <div className="break-words text-slate-600">
                  {supplier.email || "No email"}
                </div>

                <div className="break-words text-slate-600">
                  {supplier.phone || "No phone"}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}