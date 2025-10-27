export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  categoryId: string;
  userId: string;
  receiptUrl?: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface CreateTransactionDto {
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  categoryId: string;
  userId: string;
  receiptUrl?: string;
}

export interface UpdateTransactionDto {
  id: string;
  title?: string;
  amount?: number;
  type?: 'income' | 'expense';
  date?: string;
  categoryId?: string;
  receiptUrl?: string;
}