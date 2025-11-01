import { TblInvoiceItem, TblVoucher } from "@/models/types";
import { readStorage, writeStorage } from "@/utils/storage";

const getSequenceStorageKey = (branchCode: string, period: string) =>
  `invseq:${branchCode}:${period}`;

const sanitizeBranchCode = (code: string) => code.replace(/\s+/g, "").toUpperCase();

const nextSequence = (branchCode: string, period: string) => {
  const key = getSequenceStorageKey(branchCode, period);
  const current = readStorage<number>(key, 0) + 1;
  writeStorage<number>(key, current);
  return current;
};

export const buildInvoiceNumber = (branchCode: string, periodYYYYMM: string) => {
  const code = sanitizeBranchCode(branchCode);
  const seq = nextSequence(code, periodYYYYMM);
  return `INV-${code}-${periodYYYYMM}-${seq.toString().padStart(4, "0")}`;
};

export const calculateInvoiceTotals = (
  items: TblInvoiceItem[],
  voucher?: TblVoucher | null,
) => {
  const totalBefore = items.reduce((acc, item) => acc + item.subtotal, 0);

  if (!voucher || !voucher.active) {
    return {
      totalBefore,
      discountAmount: 0,
      totalAfter: totalBefore,
    };
  }

  let discountAmount = 0;
  if (voucher.type === "PERCENT") {
    discountAmount = Math.round(totalBefore * (voucher.value / 100));
  } else {
    discountAmount = voucher.value;
  }

  const totalAfter = Math.max(totalBefore - discountAmount, 0);

  return {
    totalBefore,
    discountAmount,
    totalAfter,
  };
};
