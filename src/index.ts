import { loadConfig } from './lib/config';
import { getImageData, imageDataToObject } from './lib/parser';
import { GoogleSheetService } from './services/google-sheet.service';

const start = async () => {
  const { classes, delta } = getImageData();
  const { headers: headersA, data: dataA } = imageDataToObject(classes[0]);
  const { headers: headersB, data: dataB } = imageDataToObject(classes[1]);
  const { headers: headersC, data: dataC } = imageDataToObject(classes[2]);
  const { headers: headersD, data: dataD } = imageDataToObject(classes[3]);
  const { headers: headersDelta, data: dataDelta } = imageDataToObject(delta);

  const googleSheet = new GoogleSheetService(loadConfig().GOOGLESHEET_ID);
  await googleSheet.load();
  console.log('GoogleSpreadsheet Service is loaded');

  const sheet1 = await googleSheet.addRows('A', headersA, dataA);
  if (sheet1) {
    console.log('Class A is filled');
  }
  const sheet2 = await googleSheet.addRows('B', headersB, dataB);
  if (sheet2) {
    console.log('Class B is filled');
  }
  const sheet3 = await googleSheet.addRows('C', headersC, dataC);
  if (sheet3) {
    console.log('Class C is filled');
  }
  const sheet4 = await googleSheet.addRows('D', headersD, dataD);
  if (sheet4) {
    console.log('Class D is filled');
  }
  const deltaSheet = await googleSheet.addRows('delta', headersDelta, dataDelta);
  if (deltaSheet) {
    console.log('Delta is filled');
  }
  console.log('The upload is done');
};

start();
