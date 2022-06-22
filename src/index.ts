import { readFileSync } from 'fs';
import { resolve } from 'path';
import { GoogleSheetService } from './services/google-sheet.service';
import { config } from 'dotenv';

config();

/**
 * Splits data from the entire file into classes (A, B, C, D), and delta calculation result.
 */
const getImageData = () => {
    const file = readFileSync(resolve('result.txt'), 'utf-8');

    const split = file.split('Class number: ');
    const calcOptDelta = split[0];
    const classA = split[1];
    const classB = split[2];
    const classC = split[3];
    const classD = split[4].split('(y + height)')[0];

    return { classes: [classA, classB, classC, classD], delta: calcOptDelta };
};

const imageDataToObject = (data: string) => {
    const headers = data.split('\n')[1].split('|');
    const rows = data.split('\n').slice(2, data.includes('Calculation', 0) ? 122 : 63);
    return {
        headers,
        data: rows.map(row => {
            return row.split(' ').reduce((obj, cur, i) => {
                return ({ ...obj, [headers[i].trim()]: cur.trim() });
            }, {});
        })
    };
};

const fillSheet = async (
    service: GoogleSheetService,
    title: string,
    headers: string[],
    data: {}[]
) => {
    const sheet = await service.addSheet(title, headers);
    if (sheet) {
        await sheet.addRows(data);
        return true;
    }
    return false;
};

const loadConfig = () => {
    const { GOOGLESHEET_ID } = process.env;
    if (!GOOGLESHEET_ID) {
        throw new Error('Spreadsheet ID is not found in the config file.');
    }
    return { GOOGLESHEET_ID };
};

const uploadToSpreadsheet = async () => {
    const { classes, delta } = getImageData();
    const { headers: headersA, data: dataA } = imageDataToObject(classes[0]);
    const { headers: headersB, data: dataB } = imageDataToObject(classes[1]);
    const { headers: headersC, data: dataC } = imageDataToObject(classes[2]);
    const { headers: headersD, data: dataD } = imageDataToObject(classes[3]);
    const { headers: headersDelta, data: dataDelta } = imageDataToObject(delta);

    const googleSheet = new GoogleSheetService(loadConfig().GOOGLESHEET_ID);
    await googleSheet.load();
    console.log('GoogleSpreadsheet Service is loaded');

    const sheet1 = await fillSheet(googleSheet, 'A', headersA, dataA);
    if (sheet1) {
        console.log('Class A is filled');
    }
    const sheet2 = await fillSheet(googleSheet, 'B', headersB, dataB);
    if (sheet2) {
        console.log('Class B is filled');
    }
    const sheet3 = await fillSheet(googleSheet, 'C', headersC, dataC);
    if (sheet3) {
        console.log('Class C is filled');
    }
    const sheet4 = await fillSheet(googleSheet, 'D', headersD, dataD);
    if (sheet4) {
        console.log('Class D is filled');
    }
    const deltaSheet = await fillSheet(googleSheet, 'delta', headersDelta, dataDelta);
    if (deltaSheet) {
        console.log('Delta is filled');
    }
};

uploadToSpreadsheet();