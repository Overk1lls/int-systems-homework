import { GoogleSpreadsheet } from "google-spreadsheet";
import { readFileSync } from "fs";
import { resolve } from "path";

type Config = {
    client_email: string;
    private_key: string;
}

export class GoogleSheetService {
    private readonly document: GoogleSpreadsheet;

    constructor(sheetId: string) {
        this.document = new GoogleSpreadsheet(sheetId);
    }

    async load() {
        const config: Config = JSON.parse(readFileSync(resolve('credentials.json'), 'utf-8'));

        await this.document.useServiceAccountAuth({ ...config });
        await this.document.loadInfo();
    }

    async addSheet(title: string, headers: string[]) {
        if (this.document.sheetsByTitle[title]) {
            return;
        }
        return this.document.addSheet({
            title,
            headerValues: headers
        });
    }
}