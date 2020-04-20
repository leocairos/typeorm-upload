import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const { income, outcome } = transactions.reduce(
      (sum, transaction) => {
        sum[transaction.type] += Number(transaction.value);
        return sum;
      },
      { income: 0, outcome: 0 },
    );

    const balance: Balance = { income, outcome, total: income - outcome };
    return balance;
  }
}

export default TransactionsRepository;
