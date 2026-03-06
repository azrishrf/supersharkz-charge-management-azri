"use client";

import { useEffect, useState } from "react";
import { Charge } from "../types/charge";

interface ChargeModalProps {
  charge: Charge | null; // null = adding new, object = editing
  charges: Charge[]; // full list — used to determine the next charge ID
  onSave: (charge: Charge) => void;
  onClose: () => void;
}

interface FormErrors {
  student_id?: string;
  charge_amount?: string;
  paid_amount?: string;
  date_charged?: string;
}

// Generates the next sequential charge ID (e.g. chg_006) based on existing charges
function generateChargeId(charges: Charge[]): string {
  const nums = charges
    .map((c) => parseInt(c.charge_id.replace("chg_", ""), 10))
    .filter((n) => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `chg_${String(next).padStart(3, "0")}`;
}

export default function ChargeModal({ charge, charges, onSave, onClose }: ChargeModalProps) {
  const isEditing = charge !== null;

  const [studentId, setStudentId] = useState(charge?.student_id ?? "");
  const [chargeAmount, setChargeAmount] = useState(charge?.charge_amount?.toString() ?? "");
  const [paidAmount, setPaidAmount] = useState(charge?.paid_amount?.toString() ?? "");
  const [dateCharged, setDateCharged] = useState(charge?.date_charged ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isVisible, setIsVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Disables Save button in edit mode when nothing has actually changed
  const hasChanges =
    !isEditing ||
    studentId !== (charge?.student_id ?? "") ||
    chargeAmount !== (charge?.charge_amount?.toString() ?? "") ||
    paidAmount !== (charge?.paid_amount?.toString() ?? "") ||
    dateCharged !== (charge?.date_charged ?? "");

  // Trigger enter animation on mount
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  function handleClose() {
    if (isSaving) return;
    setIsVisible(false);
    setTimeout(onClose, 200);
  }

  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (!studentId.trim()) {
      newErrors.student_id = "Student ID is required";
    }

    const chargeNum = parseFloat(chargeAmount);
    if (!chargeAmount || isNaN(chargeNum) || chargeNum <= 0) {
      newErrors.charge_amount = "Must be a positive number";
    }

    const paidNum = paidAmount === "" ? 0 : parseFloat(paidAmount);
    if (!isNaN(parseFloat(paidAmount)) && paidNum < 0) {
      newErrors.paid_amount = "Must be 0 or more";
    } else if (!isNaN(chargeNum) && paidNum > chargeNum) {
      newErrors.paid_amount = "Cannot exceed charge amount";
    }

    if (!dateCharged) {
      newErrors.date_charged = "Date is required";
    }

    return newErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    const savedCharge: Charge = {
      charge_id: charge?.charge_id ?? generateChargeId(charges),
      charge_amount: parseFloat(parseFloat(chargeAmount).toFixed(2)),
      paid_amount: parseFloat(parseFloat(paidAmount || "0").toFixed(2)),
      student_id: studentId.trim(),
      date_charged: dateCharged,
    };

    setIsSaving(true);
    setTimeout(() => {
      onSave(savedCharge);
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
        className={`bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 transition-all duration-200 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {isEditing ? "Edit Charge Record" : "New Charge Record"}
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">
              {isEditing ? "Update the details below" : "Fill in the details below"}
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">
          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                setErrors((prev) => ({ ...prev, student_id: undefined }));
              }}
              placeholder="e.g. stu_101"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.student_id ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.student_id && <p className="text-xs text-red-500 mt-1">{errors.student_id}</p>}
          </div>

          {/* Charge Amount + Paid Amount side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Charge Amount (RM)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={chargeAmount}
                onChange={(e) => {
                  setChargeAmount(e.target.value);
                  setErrors((prev) => ({ ...prev, charge_amount: undefined }));
                }}
                placeholder="0.00"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.charge_amount ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.charge_amount && (
                <p className="text-xs text-red-500 mt-1">{errors.charge_amount}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paid Amount (RM)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={paidAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  setPaidAmount(val);
                  const chargeNum = parseFloat(chargeAmount);
                  const paidNum = parseFloat(val);
                  if (!isNaN(chargeNum) && !isNaN(paidNum) && paidNum > chargeNum) {
                    setErrors((prev) => ({ ...prev, paid_amount: "Cannot exceed charge amount" }));
                  } else {
                    setErrors((prev) => ({ ...prev, paid_amount: undefined }));
                  }
                }}
                placeholder="0.00"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.paid_amount ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.paid_amount && (
                <p className="text-xs text-red-500 mt-1">{errors.paid_amount}</p>
              )}
            </div>
          </div>

          {/* Date Charged */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Charged</label>
            <input
              type="date"
              value={dateCharged}
              onChange={(e) => {
                setDateCharged(e.target.value);
                setErrors((prev) => ({ ...prev, date_charged: undefined }));
              }}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date_charged ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.date_charged && (
              <p className="text-xs text-red-500 mt-1">{errors.date_charged}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={handleClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!hasChanges || isSaving}>
              {isSaving && (
                <svg
                  className="animate-spin h-4 w-4 text-current"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Add Charge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
