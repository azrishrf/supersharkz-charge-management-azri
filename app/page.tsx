"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import ChargeModal from "./components/ChargeModal";
import ChargeTable from "./components/ChargeTable";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { mockCharges } from "./data/mockCharges";
import { Charge } from "./types/charge";

export default function Home() {
  const [charges, setCharges] = useState<Charge[]>(mockCharges);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);
  const [deletingCharge, setDeletingCharge] = useState<Charge | null>(null);

  function handleAdd() {
    setEditingCharge(null);
    setModalOpen(true);
  }

  function handleEdit(charge: Charge) {
    setEditingCharge(charge);
    setModalOpen(true);
  }

  function handleSave(saved: Charge) {
    setCharges((prev) => {
      const exists = prev.find((c) => c.charge_id === saved.charge_id);
      if (exists) {
        return prev.map((c) => (c.charge_id === saved.charge_id ? saved : c));
      }
      return [saved, ...prev];
    });
    setModalOpen(false);
    setEditingCharge(null);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingCharge(null);
  }

  function handleDelete(chargeId: string) {
    const charge = charges.find((c) => c.charge_id === chargeId);
    if (charge) setDeletingCharge(charge);
  }

  function confirmDelete() {
    if (!deletingCharge) return;
    setCharges((prev) => prev.filter((c) => c.charge_id !== deletingCharge.charge_id));
    setDeletingCharge(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 gap-2">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Supersharkz Swim School</h1>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Charge Management</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Master Ledger</h2>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage student charges, payments, and outstanding balances across the
              academy.
            </p>
          </div>
          <button onClick={handleAdd} className="btn-primary w-full md:w-auto">
            <FaPlus className="w-3 h-3" /> New Charge
          </button>
        </div>

        {/* Charge Table */}
        <ChargeTable charges={charges} onEdit={handleEdit} onDelete={handleDelete} />
      </main>

      {/* Charge Modal */}
      {modalOpen && (
        <ChargeModal charge={editingCharge} onSave={handleSave} onClose={handleCloseModal} />
      )}

      {/* Delete Confirmation Modal */}
      {deletingCharge && (
        <DeleteConfirmModal
          charge={deletingCharge}
          onConfirm={confirmDelete}
          onClose={() => setDeletingCharge(null)}
        />
      )}
    </div>
  );
}
