// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

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
    const categoriesRepository = getRepository(Category);

    /* const findCategory = await categoriesRepository.findOne({
      where: { title: category },
    }); */

    /* if (!findCategory) {
      const newCategory = await categoriesRepository.save({ title: category });
    } */

    const newCategory = await categoriesRepository.save({ title: category });
    const category_id = newCategory.id;

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id,
    });

    console.log({ transaction });
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
