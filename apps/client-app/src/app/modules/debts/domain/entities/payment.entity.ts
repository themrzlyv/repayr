export type PaymentEntity = {
  amount: {
    value: number;
    currency: string;
  };
  id: string;
  createdAt: Date;
};
