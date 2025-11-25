import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const fileName = 'result.txt';
const classSeparator = 'Class number: ';

/**
 * Splits data from the entire file into classes (A, B, C, D), and delta calculation result.
 * @returns An object that contains an array of classes, and delta
 */
export const getImageData = () => {
  if (!existsSync(resolve(fileName))) {
    throw new Error(`${fileName} is not found!`);
  }
  const file = readFileSync(resolve(fileName), 'utf-8');

  const split = file.split(classSeparator);
  const calcOptDelta = split[0];
  const classA = split[1];
  const classB = split[2];
  const classC = split[3];
  const classD = split[4].split('(y + height)')[0];

  return { classes: [classA, classB, classC, classD], delta: calcOptDelta };
};

/**
 * Converts a data string (either class or delta) into an array of objects, with keys are being the headers, and values are being parsed from the file.
 * @param data A data string (either class or delta).
 * @returns An array of objects.
 */
export const imageDataToObject = (data: string) => {
  const headers = data.split('\n')[1].split('|');
  const rows = data.split('\n').slice(2, data.includes('Calculation', 0) ? 122 : 63);
  return {
    headers,
    data: rows.map<Record<string, string>>((row) =>
      row.split(' ').reduce<Record<string, string>>(
        (obj, cur, i) => ({ ...obj, [headers[i].trim()]: cur.trim() }),
        {},
      ),
    ),
  };
};
