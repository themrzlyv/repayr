export const EPS = 0.005;

export function isFullyPaid(totalPaid: number, totalAmount: number, eps = EPS) {
  return Number(totalPaid) >= Number(totalAmount) - eps;
}
