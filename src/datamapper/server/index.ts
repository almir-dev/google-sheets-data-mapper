export type Sheet = GoogleAppsScript.Spreadsheet.Sheet;
export type HtmlOutput = GoogleAppsScript.HTML.HtmlOutput;

/**
 * Data needed when updating sheet rows
 * @spreadSheetName name of the spreadSheet
 * @sheetName name of the sheet
 * @lookupColumnName name of the column to search key
 * @updateValue value which will be updated into the sheet
 */
interface UpdateOperation {
  spreadsheetId: string;
  sheetName: string;
  lookupColumnName: string;
  updateValues: UpdateValue[];
}

/**
 * Update value.
 * @lookupValue lookupValue
 * @values values array
 */
interface UpdateValue {
  lookupValue: object;
  values: object[];
}

/**
 * Sheet map
 */
interface SheetMap {
  [index: string]: Sheet;
}

/**
 * Sheet data of a row
 * @sheet sheet
 * @range range of the sheet
 * @values value of the row
 */
interface SheetRowData {
  sheet: Sheet;
  range: string;
  values: object[];
}

/**
 * Update many sheet rows.
 * @param updateOperations update operations
 */
function updateManySheetRows(updateOperations: UpdateOperation[]) {
  const sheetMap: SheetMap = {};

  for (const operation of updateOperations) {
    const { spreadsheetId, sheetName } = operation;
    if (!sheetMap[sheetName]) {
      sheetMap[sheetName] = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
    }
  }

  const sheetList = Object.values(sheetMap);
  lockSheetList(sheetList);

  let backupData;
  try {
    backupData = createBackupSheetRowData(updateOperations, sheetMap);
  } catch (error) {
    unlockSheetList(sheetList);
    throw new Error("Failed to create backup " + error);
  }

  for (const operation of updateOperations) {
    const { sheetName, lookupColumnName, updateValues } = operation;
    const sheet = sheetMap[sheetName];

    for (const updateValue of updateValues) {
      try {
        updateSingleSheetRow(sheet, lookupColumnName, updateValue);
      } catch (error) {
        revertSheetUpdate(backupData);
        break;
      }
    }
  }

  unlockSheetList(sheetList);
}

/**
 * Reverts sheet data.
 * @param backupData backup data
 */
function revertSheetUpdate(backupData: SheetRowData[]) {
  for (const data of backupData) {
    const { sheet, range, values } = data;
    sheet.getRange(range).setValues([values]);
  }
}

/**
 * Create a list of sheet row data, by searching data from the update operation queries.
 * @param updateOperations update operations
 * @param sheetMap sheet map
 */
function createBackupSheetRowData(updateOperations: UpdateOperation[], sheetMap: SheetMap): SheetRowData[] {
  const backupData: SheetRowData[] = [];
  for (const operation of updateOperations) {
    const { sheetName, lookupColumnName, updateValues } = operation;
    const sheet = sheetMap[sheetName];

    updateValues.forEach((updateValue: UpdateValue) => {
      const existingRow = getExistingSheetRow(sheet, lookupColumnName, updateValue.lookupValue);
      backupData.push(existingRow);
    });
  }
  return backupData;
}

/**
 * Retrieves the data from a sheet row
 * @param sheet sheet
 * @param lookupColumnName lookup column to find the needed row
 * @param lookupValue lookup value
 */
function getExistingSheetRow(sheet: Sheet, lookupColumnName: string, lookupValue: object): SheetRowData {
  const columnNumber = letterToColumn(lookupColumnName);
  const rowNumber = getRowNumberByLookupValue(sheet, columnNumber, lookupValue);
  const range = rowNumber + ":" + rowNumber;
  const values = sheet.getRange(rowNumber + ":" + rowNumber).getValues()[0];
  return { sheet, range, values };
}

/**
 * Update a single row in a sheet
 * @param sheet sheet
 * @param lookupColumnName lookup column to find the needed row
 * @param updateValue values to update the row
 */
function updateSingleSheetRow(sheet: Sheet, lookupColumnName: string, updateValue: UpdateValue) {
  const columnNumber = letterToColumn(lookupColumnName);
  const rowNumber = getRowNumberByLookupValue(sheet, columnNumber, updateValue.lookupValue);
  sheet.getRange(rowNumber + ":" + rowNumber).setValues([updateValue.values]);
}

/**
 * Delete a row in a sheet.
 * @param spreadSheetId id of the spreadsheet
 * @param sheetName name of sheet
 * @param lookupColumnName name of the lookup column
 * @param lookupValue value used to lookup which row to delete
 */
function deleteSheetRow(spreadSheetId: string, sheetName: string, lookupColumnName: string, lookupValue: object) {
  const sheet = SpreadsheetApp.openById(spreadSheetId).getSheetByName(sheetName);
  lockSheet(sheet);

  try {
    const columnNumber = letterToColumn(lookupColumnName);
    const rowToDelete = getRowNumberByLookupValue(sheet, columnNumber, lookupValue);
    sheet.deleteRow(rowToDelete);
  } catch (error) {
    unlockSheet(sheet);
    throw new Error("Failed to delete row " + error);
  }

  unlockSheet(sheet);
}

function foo() {
  const sheetId = "1Bswrjv8evr2PAP5Cmnfb3XbI5voxMeDwBdvLxurf-5A";
  const sheetName = "StudentTable";
  const pkField = "id";
  const id = "id1623181921547";
  deleteSheetRow(sheetId, sheetName, pkField, (id as unknown) as object);
}

/**
 * Create a new row in a sheet.
 * @param spreadSheetId id of the spreadsheet
 * @param sheetName name of the sheet
 * @param values values which will be inserted in the row
 * @param columnName name of the lookupColumn to check for duplicates
 * @param lookupValue lookupValue used to check for duplicated
 * @return {{errorMessage: string}} error message in case there was an error
 */
function createSheetRow(
  spreadSheetId: string,
  sheetName: string,
  values: string[],
  columnName: string,
  lookupValue: string
) {
  const sheet = SpreadsheetApp.openById(spreadSheetId).getSheetByName(sheetName);

  lockSheet(sheet);

  if (hasDuplicate(sheet, columnName, (lookupValue as unknown) as object)) {
    unlockSheet(sheet);
    return { errorMessage: "Cannot create row with duplicate id: " + lookupValue };
  }

  sheet.insertRowBefore(2);

  values.forEach((value, index) => {
    sheet
      .getRange("2:2")
      .getCell(1, index + 1)
      .setValue([value]);
  });

  unlockSheet(sheet);
}

/**
 * Locks a sheet for writer operations, by removing all editors except the current editor.
 * @param sheet google sheet
 */
function lockSheet(sheet: Sheet) {
  const editors = sheet.protect().getEditors();
  const currentEditor = Session.getActiveUser().getEmail();

  editors.forEach(e => {
    if (e.getEmail() !== currentEditor) {
      sheet.protect().removeEditor(e.getEmail());
    }
  });
}

/**
 * Locks a list of sheets for writer operations, by removing all editors except the current editor.
 * @param sheetList list of google sheets
 */
function lockSheetList(sheetList: Sheet[]) {
  const currentEditor = Session.getActiveUser().getEmail();

  for (const sheet of sheetList) {
    const editors = sheet.protect().getEditors();

    editors.forEach(e => {
      if (e.getEmail() !== currentEditor) {
        sheet.protect().removeEditor(e.getEmail());
      }
    });
  }
}

/**
 * Unlocks a sheet by removing the protection on it.
 * @param sheet
 */
function unlockSheet(sheet: Sheet) {
  sheet.protect().remove();
}

/**
 * Unlocks a list of sheets by removing the protection on it.
 * @param sheetList list of sheets
 */
function unlockSheetList(sheetList: Sheet[]) {
  sheetList.forEach(sheet => sheet.protect().remove());
}

/**
 * Checks if the given sheet has the given value in the given column
 * @param sheet sheet
 * @param lookupColumnName name of the column
 * @param lookupValue lookup value
 * @return true if the lookup value exists in the sheet
 */
function hasDuplicate(sheet: Sheet, lookupColumnName: string, lookupValue: object) {
  const range = lookupColumnName + ":" + lookupColumnName;
  const colValues = sheet
    .getRange(range)
    .getValues()
    .map(e => e[0]);
  return colValues.indexOf(lookupValue) > -1;
}

/**
 * Retrieves the number of the column based on the column name.
 * @param columnName name of the column
 * @return column number
 */
function letterToColumn(columnName: string) {
  let column = 0;
  let length = columnName.length;
  for (let i = 0; i < length; i++) {
    column += (columnName.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }
  return column - 1;
}
//
// /**
//  * Retrieves the id of the spreadsheet.
//  * @param spreadsheetName name of the spreadsheet
//  * @return id of the spreadsheet
//  */
// function getSpreadSheetIdByName(spreadsheetName: string) {
//   return DriveApp.getFilesByName(spreadsheetName)
//     .next()
//     .getId();
// }

/**
 * Retrieves the row number of the searched value.
 * @param sheet sheet
 * @param columnNumber column number
 * @param lookupValue lookupValue
 * @return row number
 */
function getRowNumberByLookupValue(sheet: Sheet, columnNumber: number, lookupValue: object) {
  const values = sheet.getDataRange().getValues();

  for (let i = 0; i < values.length; ++i) {
    if (values[i][columnNumber] === lookupValue) {
      return i + 1;
    }
  }

  return -1;
}

/** Retrieves the OauthToken. */
function getToken() {
  return ScriptApp.getOAuthToken();
}

function findWithoutCriteria(spreadsheetId: string, sheetName: string) {
  const newToken = getToken();

  let request = "https://docs.google.com/spreadsheets/d/";
  request += spreadsheetId;
  request += "/gviz/tq?access_token=" + newToken;
  request += "&select%20*%20";
  request += "&sheet=" + sheetName;
  request += "&tqx=reqId%3A0";

  const response = UrlFetchApp.fetch(request).getContentText();
  return convertQueryResponseToDataArray(response);
}

function findWithCriteria(query: string, spreadsheetId: string, sheetName: string) {
  const newToken = getToken();

  let request = "https://docs.google.com/spreadsheets/d/";
  request += spreadsheetId;
  request += "/gviz/tq?access_token=" + newToken;
  request += "&tq=select%20*%20 WHERE " + query;
  request += "&sheet=" + sheetName;
  request += "&tqx=reqId%3A0";

  const response = UrlFetchApp.fetch(request).getContentText();
  return convertQueryResponseToDataArray(response);
}

function convertQueryResponseToDataArray(responseText: string) {
  let jsonText = responseText.replace("google.visualization.Query.setResponse(", "");
  jsonText = jsonText.replace("/*O_o*/", "");
  jsonText = jsonText.slice(0, -2);
  return JSON.parse(jsonText).table;
}

/**
 * Method needed by google, the generated html out of it will be used to deploy as a web app.
 * @return HtmlOutput html output
 */

export function doGet() {
  const result = HtmlService.createTemplateFromFile("diploma.html").evaluate();
  const c1 = HtmlService.createTemplateFromFile("diploma.html").getCode();
  const c2 = HtmlService.createTemplateFromFile("diploma.html").getCodeWithComments();
  const c3 = HtmlService.createTemplateFromFile("diploma.html").getRawContent();
  const c4 = HtmlService.createTemplateFromFile("diploma.html").evaluate().asTemplate().evaluate();


  // console.log("C1", c1);
  // console.log("C2", c2);
  // console.log("C3", c3);

  const content = c4.getContent();

  const parts: string[] = [];
  const amount = 10;
  let start = 0;
  let step = content.length / amount;
  for(let i = 0; i < amount; ++i) {
    const c = content.substr(start, step);
    start += step;
    parts.push(c);
  }

  for(let i = 0; i < amount; ++i) {
    console.log("Result is: ", parts[i]);
  }


  return result;
}

// Expose public functions by attaching to `global`

// @ts-ignore
global.doGet = doGet;
// @ts-ignore
global.foo = foo;
// @ts-ignore
global.findWithoutCriteria = findWithoutCriteria;
// @ts-ignore
global.findWithCriteria = findWithCriteria;
// @ts-ignore
global.updateManySheetRows = updateManySheetRows;
// @ts-ignore
global.deleteSheetRow = deleteSheetRow;
// @ts-ignore
global.createSheetRow = createSheetRow;
