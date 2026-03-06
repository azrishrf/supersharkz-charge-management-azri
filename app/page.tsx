"use client";

import { useState } from "react";
import ChargeTable from "./components/ChargeTable";
import { mockCharges } from "./data/mockCharges";
import { Charge } from "./types/charge";

export default function Home() {
  const [charges, setCharges] = useState<Charge[]>(mockCharges);

  function handleEdit(charge: Charge) {
    // TODO: implement in next commit
  }

  function handleDelete(chargeId: string) {
    // TODO: implement in next commit
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900">Supersharkz</h1>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Charge Management</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Page Title */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Master Ledger</h2>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage student charges, payments, and outstanding balances across the
              academy.
            </p>
          </div>
        </div>

        {/* Charge Table */}
        <ChargeTable charges={charges} onEdit={handleEdit} onDelete={handleDelete} />
      </main>
    </div>
  );
}
