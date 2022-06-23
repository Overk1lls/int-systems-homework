# int-systems-homework
This is a practice work for one of subjects in my university. It allows to read and parse a `.txt` file that comes from another program (written in Java),
and upload the data into GoogleSpreadsheet.

## Introduction
The example of a `.txt` file that needs to be preset in the project, is the `result.txt` [file](https://github.com/Overk1lls/int-systems-homework/blob/master/result.txt).
Then you will need your service account credentials from Google, to be able to use the bot and its GoogleSpreadsheet Services. Read https://cloud.google.com/iam/docs/service-accounts

Download the `credentials.json` file for the service, and put it in the project directory.  
Also, don't forget about the spreadsheet ID! (paste it in the `.env` file, like `GOOGLESHEET_ID=id`.

An error will be thrown when the program is executed, if that configuration hasn't been set up.

The result of the program will be the GoogleSpreadsheet Worksheet with all the neccessary information filled up.  
The example is https://docs.google.com/spreadsheets/d/1aXVyyX2gvcnUhoQEqrLUWyKYcLU7_CgPAfndJgMvkRE

## Getting Started
* `npm install`
* `npm run start:dev` or `npm start`