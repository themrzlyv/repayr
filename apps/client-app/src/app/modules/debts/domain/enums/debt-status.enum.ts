export const DebtStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
  CANCELLED: "CANCELLED",
} as const;

export type DebtStatusEnum = (typeof DebtStatus)[keyof typeof DebtStatus];
