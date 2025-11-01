import { TransactionStatus } from "@/models/enums";

export type PeriodType = "DAY" | "WEEK" | "MONTH" | "YEAR";

export const nowISO = () => new Date().toISOString();

export const toISO = (value: Date | string | number) => new Date(value).toISOString();

export const formatPeriodKey = (value: Date | string, type: PeriodType): string => {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getUTCFullYear();

  switch (type) {
    case "DAY":
      return date.toISOString().slice(0, 10);
    case "WEEK": {
      const temp = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
      const dayNum = temp.getUTCDay() || 7;
      temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
      const firstDayOfYear = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
      const week = Math.ceil(((temp.getTime() - firstDayOfYear.getTime()) / 86400000 + 1) / 7);
      return `${temp.getUTCFullYear()}-W${week.toString().padStart(2, "0")}`;
    }
    case "MONTH":
      return `${year}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}`;
    case "YEAR":
      return `${year}`;
    default:
      return "";
  }
};

export const periodTypeFromStatus = (status: TransactionStatus): PeriodType => {
  switch (status) {
    case TransactionStatus.EXPIRED:
      return "MONTH";
    default:
      return "MONTH";
  }
};
