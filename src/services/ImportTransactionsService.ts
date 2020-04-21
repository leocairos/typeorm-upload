import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import ImportCSV from '../util/ImportCSV';

class ImportTransactionsService {
  async execute(importFilename: string): Promise<Transaction[]> {
    const importCSV = new ImportCSV();
    const records = await importCSV.importFile(importFilename);
    // console.log('records: ', records);

    const transactions: Transaction[] = [];
    records.forEach(async row => {
      const createTransactionService = new CreateTransactionService();
      const transaction = await createTransactionService.execute({
        title: row.title,
        value: row.value,
        type: row.type,
        category: row.category,
      });
      transactions.push(transaction);
    });

    // console.log('transactions: ', transactions);
    return transactions;
  }
}

export default ImportTransactionsService;
