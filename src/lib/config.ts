import { config } from 'dotenv';

config();

export const loadConfig = () => {
  const { GOOGLESHEET_ID } = process.env;
  if (!GOOGLESHEET_ID) {
    throw new Error('Spreadsheet ID is not found in the config file.');
  }
  return { GOOGLESHEET_ID };
};
