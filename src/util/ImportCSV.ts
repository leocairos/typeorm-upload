import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import uploadConfig from '../config/upload';

interface Request {
  fileName: string;
}

interface Response {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportCSV {
  public async importFile(fileName: string): Promise<Response[]> {
    const records: Response[] = [];

    const importFilePath = path.join(uploadConfig.directory, fileName);
    const importFileExists = await fs.promises.stat(importFilePath);

    if (importFileExists) {
      await fs
        .createReadStream(importFilePath)
        .pipe(
          csv({
            mapValues: ({ header, index, value }) => value.trim(),
            mapHeaders: ({ header, index }) => header.trim(),
          }),
        )
        .on('data', data => records.push(data));
      // .on('end', () => console.log('import: ', records));

      await fs.promises.unlink(importFilePath);
    }
    return records;
  }
}

export default ImportCSV;
