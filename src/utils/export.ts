import type { Tables } from "@/models/types";

const isBrowser = () => typeof window !== "undefined";

const triggerDownload = (blob: Blob, filename: string) => {
  if (!isBrowser()) return;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const exportToXLSX = async (rows: any[], filename: string, sheetName = "Data") => {
  if (!rows.length) {
    console.warn("No rows provided for XLSX export");
    return;
  }
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  triggerDownload(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), filename);
};

export const exportAllJSON = (tables: Tables, filename = "new-concept-backup.json") => {
  const blob = new Blob([JSON.stringify(tables, null, 2)], { type: "application/json" });
  triggerDownload(blob, filename);
};

export const importAllJSON = async (file: File): Promise<Tables> => {
  const text = await file.text();
  const parsed = JSON.parse(text);
  return parsed as Tables;
};
