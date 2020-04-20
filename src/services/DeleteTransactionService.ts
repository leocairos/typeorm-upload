import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const transactionExists = await transactionsRepository.findOne(id);

    if (!transactionExists) {
      throw new AppError('Transaction not exists.', 400);
    }

    const { total } = await transactionsRepository.getBalance();
    const newTotal = total - transactionExists.value;

    if (transactionExists.type === 'income' && newTotal < 0) {
      throw new AppError(
        'Transaction cannot be deleted as the balance would be insufficient.',
        400,
      );
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
