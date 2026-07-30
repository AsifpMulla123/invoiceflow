interface TaxInput {
  businessState: string;
  clientState: string;
  clientCountry: string;
  subtotal: number;
}

interface TaxResult {
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  exportNote: string | null;
}

export function calculateTax({
  businessState,
  clientState,
  clientCountry,
  subtotal,
}: TaxInput): TaxResult {
  // Case 1: client is outside India — export, zero-rated under LUT
  if (clientCountry.trim().toLowerCase() !== "india") {
    return {
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: subtotal,
      exportNote: "Supply meant for export under LUT without payment of IGST",
    };
  }

  // Case 2: client is in the same state as the business — CGST + SGST split
  if (businessState.trim().toLowerCase() === clientState.trim().toLowerCase()) {
    const cgst = round(subtotal * 0.09);
    const sgst = round(subtotal * 0.09);
    return {
      cgst,
      sgst,
      igst: 0,
      total: round(subtotal + cgst + sgst),
      exportNote: null,
    };
  }

  // Case 3: client is in a different Indian state — IGST only
  const igst = round(subtotal * 0.18);
  return {
    cgst: 0,
    sgst: 0,
    igst,
    total: round(subtotal + igst),
    exportNote: null,
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
