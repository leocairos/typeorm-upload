import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parse';

import AppError from '../errors/AppError';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(importFilename: string): Promise<Transaction[]> {
    // TODO
    const transactionCSV = [];
    fs.createReadStream(importFilename)
      .pipe(csv())
      .on('data', data => {
        console.log(`${data.name}`);
      });
  }
}

export default ImportTransactionsService;
