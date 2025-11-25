import { readFileSync } from 'fs';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { resolve } from 'path';

type Config = {
  client_email: string;
  private_key: string;
};

export class GoogleSheetService {
  private readonly document: GoogleSpreadsheet;

  constructor(sheetId: string) {
    const config: Config = JSON.parse(readFileSync(resolve('credentials.json'), 'utf-8'));
    const serviceAccountAuth = new JWT({
      email: config.client_email,
      key: config.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    this.document = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
  }

  async load() {
    await this.document.loadInfo();
  }

  async addSheet(title: string, headers: string[]) {
    if (!this.document.sheetsByTitle[title]) {
      return await this.document.addSheet({
        title,
        headerValues: headers,
      });
    }
  }

  async addRows(name: string, headers: string[], data: Record<string, string>[]) {
    const sheet = await this.addSheet(name, headers);
    if (sheet) {
      return await sheet.addRows(data);
    }
  }
}
