import fs from 'fs';
import neatCsv from 'neat-csv';

import path from 'path';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

interface Row {
  title: string;
  type: 'income' | 'outcome';
  value: string;
  category: string;
}

class ImportTransactionsService {
  async execute(importFilename: string): Promise<Transaction[]> {
    const importFilePath = path.join(uploadConfig.directory, importFilename);
    const data = await fs.promises.readFile(importFilePath);
    const rows: Row[] = await neatCsv(data);
    const createTransaction = new CreateTransactionService();
    const createdTransactions = [] as Transaction[];

    const trimmedRows = rows.map(row => {
      const trimmedRow = Object.entries(row).reduce((acc, entry) => {
        const [key, value] = entry;

        const trimmedKey = key.trim();
        const trimmedValue = value.trim();

        return { ...acc, [trimmedKey]: trimmedValue };
      }, {} as Row);

      return trimmedRow;
    });

    await Promise.all(
      trimmedRows.map(async row => {
        const transactionData = { ...row, value: parseFloat(row.value) };

        const createdTransaction = await createTransaction.execute(
          transactionData,
        );

        createdTransactions.push(createdTransaction);
      }),
    );

    await fs.promises.unlink(importFilePath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;

/* import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import ImportCSV from '../util/ImportCSV';

class ImportTransactionsService {
  async execute(importFilename: string): Promise<Transaction[]> {
    const importCSV = new ImportCSV();
    const records = await importCSV.importFile(importFilename);
    // console.log('records: ', records);

    const transactions = await Promise.all(
      records.map(async row => {
        const createTransactionService = new CreateTransactionService();
        const transaction = await createTransactionService.execute({
          title: row.title,
          value: row.value,
          type: row.type,
          category: row.category,
        });
        return transaction;
      }),
    );

    return transactions;
    // console.log('transactions: ', transactions);
  }
}

export default ImportTransactionsService;
*/
