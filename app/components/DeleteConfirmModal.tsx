"use client";

import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Charge } from "../types/charge";

interface DeleteConfirmModalProps {
  charge: Charge;
  onConfirm: () => void;
  onClose: () => void;
}

function formatCurrency(amount: number): string {
  return `RM ${amount.toFixed(2)}`;
}

export default function DeleteConfirmModal({
  charge,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  function handleClose() {
    setIsVisible(false);
    setTimeout(onClose, 200);
  }

  function handleConfirm() {
    setIsDeleting(true);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(onConfirm, 200);
    }, 600);
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 transition-all duration-200 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon + Title */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <FiTrash2 className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Delete this charge?</h3>
          <p className="text-sm text-gray-500 text-center mt-1">
            This action cannot be undone. The charge record will be permanently removed.
          </p>
        </div>

        {/* Charge Details Table */}
        <div className="mx-6 mb-6 rounded-lg border border-gray-200 text-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Charge Details
            </p>
          </div>
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-2 text-gray-500">Charge ID</td>
                <td className="px-4 py-2 text-right font-semibold text-gray-900">
                  {charge.charge_id}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-2 text-gray-500">Student ID</td>
                <td className="px-4 py-2 text-right font-semibold text-gray-900">
                  {charge.student_id}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-2 text-gray-500">Amount</td>
                <td className="px-4 py-2 text-right font-semibold text-gray-900">
                  {formatCurrency(charge.charge_amount)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-500">Date</td>
                <td className="px-4 py-2 text-right font-semibold text-gray-900">
                  {charge.date_charged}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-2">
          <button onClick={handleConfirm} className="btn-danger-full" disabled={isDeleting}>
            {isDeleting ? (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <FiTrash2 className="w-4 h-4" />
            )}
            {isDeleting ? "Deleting..." : "Yes, delete permanently"}
          </button>
          <button onClick={handleClose} className="w-full btn-secondary">
            Cancel, keep the charge
          </button>
        </div>
      </div>
    </div>
  );
}
