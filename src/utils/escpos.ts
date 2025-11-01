import { TblInvoice, TblInvoiceItem, TblBranch, TblStudent } from "@/models/types";
import { formatIDR } from "@/utils/number";

const ESC = "\x1B";

const reset = `${ESC}@`;
const alignCenter = `${ESC}a\x01`;
const alignLeft = `${ESC}a\x00`;
const doubleOn = `${ESC}!\x11`;
const doubleOff = `${ESC}!\x00`;
const feed = (n: number) => `${ESC}d${String.fromCharCode(n)}`;

export const buildEscPosForInvoice = (
  invoice: TblInvoice,
  items: TblInvoiceItem[],
  branch: TblBranch,
  student: TblStudent,
) => {
  const lines: string[] = [];
  lines.push(reset);
  lines.push(alignCenter);
  lines.push(doubleOn);
  lines.push(`${branch.name}\n`);
  lines.push(doubleOff);
  lines.push(`${branch.address}\n`);
  lines.push(`${branch.phone}\n`);
  lines.push(feed(1));
  lines.push(`${alignLeft}Invoice: ${invoice.visibleNumber}\n`);
  lines.push(`Student: ${student.fullName}\n`);
  lines.push(`Period: ${invoice.period}\n`);
  lines.push(feed(1));
  lines.push("Items:\n");

  items.forEach((item) => {
    const subtotal = formatIDR(item.subtotal);
    lines.push(`${item.description}\n`);
    lines.push(`  ${item.qty} x ${formatIDR(item.price)} = ${subtotal}\n`);
  });

  lines.push(feed(1));
  lines.push(`Total: ${formatIDR(invoice.totalAmount)}\n`);
  if (invoice.discountAmount) {
    lines.push(`Discount: ${formatIDR(invoice.discountAmount)}\n`);
  }
  lines.push(`Status: ${invoice.status}\n`);
  if (invoice.paidAt) {
    lines.push(`Paid At: ${invoice.paidAt}\n`);
  }
  lines.push(feed(2));
  lines.push(alignCenter);
  lines.push("Thank you!\n");
  lines.push(feed(3));

  return lines.join("");
};
