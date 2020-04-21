import { getRepository, getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('Outcome value exceds your avaliable total', 400);
    }

    const categoriesRepository = getRepository(Category);

    const findCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    const thisCategory =
      findCategory || (await categoriesRepository.save({ title: category }));

    const transaction = await transactionsRepository.create({
      title,
      type,
      value,
      category_id: thisCategory.id,
    });

    await transactionsRepository.save(transaction);

    /* await console.log(
      `Create Transaction Service: ${transaction.title} at ${Date.now()}`,
    ); */

    return transaction;
  }
}

export default CreateTransactionService;
