"use client";

import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Charge } from "../types/charge";

interface ChargeTableProps {
  charges: Charge[];
  onEdit: (charge: Charge) => void;
  onDelete: (chargeId: string) => void;
}

function getStatus(charge: Charge): "PAID" | "PARTIAL" | "UNPAID" {
  if (charge.paid_amount >= charge.charge_amount) return "PAID";
  if (charge.paid_amount > 0) return "PARTIAL";
  return "UNPAID";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return `RM ${amount.toFixed(2)}`;
}

const statusStyles: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  PARTIAL: "bg-amber-100 text-amber-800",
  UNPAID: "bg-red-100 text-red-700",
};

export default function ChargeTable({ charges, onEdit, onDelete }: ChargeTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          All Charges{" "}
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {charges.length}
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Student</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Charged</th>
              <th className="px-6 py-3 text-right">Paid</th>
              <th className="px-6 py-3 text-right">Outstanding</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {charges.map((charge) => {
              const status = getStatus(charge);
              const outstanding = charge.charge_amount - charge.paid_amount;

              return (
                <tr key={charge.charge_id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatDate(charge.date_charged)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {charge.student_id}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[status]}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-right tabular-nums">
                    {formatCurrency(charge.charge_amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-right tabular-nums">
                    {formatCurrency(charge.paid_amount)}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-semibold text-right tabular-nums ${
                      outstanding > 0 ? "text-red-500" : "text-gray-700"
                    }`}
                  >
                    {formatCurrency(outstanding)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(charge)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer font-semibold"
                      >
                        <FiEdit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(charge.charge_id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-red-600 rounded-xl hover:bg-red-700 cursor-pointer font-semibold"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {charges.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-gray-400">
            No charges found. Click &ldquo;New Charge&rdquo; to add one.
          </div>
        )}
      </div>
    </div>
  );
}
