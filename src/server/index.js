/**
 * Method needed by google, the generated html out of it will be used to deploy as a web app.
 * @return {GoogleAppsScript.HTML.HtmlOutput}
 */
function doGet() {
    return HtmlService.createTemplateFromFile("diploma.html").evaluate();
}

/**
 * Delete a row in a sheet.
 * @param spreadSheetName name of the spreadsheet
 * @param sheetName name of sheet
 * @param lookupColumnName name of the lookup column
 * @param lookupValue value used to lookup which row to delete
 */
function deleteSheetRow(spreadSheetName, sheetName, lookupColumnName, lookupValue) {
    const spreadSheetId = getSpreadSheetIdByName(spreadSheetName);
    const sheet = SpreadsheetApp.openById(spreadSheetId).getSheetByName(sheetName);

    lockSheet(sheet);

    const columnNumber = getColumnNumberByName(sheet, lookupColumnName);
    const rowToDelete = getRowNumberByLookupValue(sheet, columnNumber, lookupValue);
    sheet.deleteRow(rowToDelete);

    unlockSheet(sheet);
}

/**
 * Create a new row in a sheet.
 * @param spreadsheetName name of the spreadsheet
 * @param sheetName name of the sheet
 * @param values values which will be inserted in the row
 * @param columnName name of the lookupColumn to check for duplicates
 * @param lookupValue lookupValue used to check for duplicated
 * @return {{errorMessage: string}} error message in case there was an error
 */
function createSheetRow(spreadsheetName, sheetName, values, columnName, lookupValue) {
    const spreadSheetId = getSpreadSheetIdByName(spreadsheetName);
    const sheet = SpreadsheetApp.openById(spreadSheetId).getSheetByName(sheetName);

    lockSheet(sheet);

    if(hasDuplicate(sheet, columnName, lookupValue)) {
        unlockSheet(sheet);
        return {errorMessage: 'Cannot create row with duplicate id: ' + lookupValue}
    }

    sheet.insertRowBefore(2);

    values.forEach((value, index) => {
        sheet.getRange('2:2').getCell(1, index + 1).setValue([value]);
    })

    unlockSheet(sheet);
}

/**
 * Locks a sheet for writer operations, by removing all editors except the current editor.
 * @param sheet google sheet
 */
function lockSheet(sheet) {
    const editors = sheet.protect().getEditors();
    const currentEditor = Session.getActiveUser().getEmail();

    editors.forEach(e => {
        if(e.getEmail() !== currentEditor) {
            sheet.protect().removeEditor(e.getEmail());
        }
    });
}

/**
 * Unlocks a sheet by removing the protection on it.
 * @param sheet
 */
function unlockSheet(sheet) {
    sheet.protect().remove()
}

/**
 * Checks if the given sheet has the given value in the given column
 * @param sheet sheet
 * @param lookupColumnName name of the column
 * @param lookupValue lookup value
 * @return true if the lookup value exists in the sheet
 */
function hasDuplicate(sheet, lookupColumnName, lookupValue) {
    const range = lookupColumnName + ":" + lookupColumnName;
    const colValues = sheet.getRange(range).getValues().map( e => e[0]);
    return colValues.indexOf(lookupValue) > -1;
}

/**
 * Retrieves the number of the column based on the column name.
 * @param sheet sheet
 * @param columnName name of the column
 * @return column number
 */
function getColumnNumberByName(sheet, columnName) {
    const headers = sheet.getDataRange().getValues().shift();
    const colindex = headers.indexOf(columnName);
    return colindex+1;

}

/**
 * Retrieves the id of the spreadsheet.
 * @param spreadsheetName name of the spreadsheet
 * @return id of the spreadsheet
 */
function getSpreadSheetIdByName(spreadsheetName) {
    return DriveApp.getFilesByName(spreadsheetName).next().getId();
}

/**
 * Retrieves the row number of the searched value.
 * @param sheet sheet
 * @param columnNumber column number
 * @param lookupValue lookupValue
 * @return row number
 */
function getRowNumberByLookupValue(sheet, columnNumber, lookupValue) {
    const values = sheet.getDataRange().getValues();

    for(let i=0; i < values.length; ++i) {
        if(values[i][columnNumber] === lookupValue) {
            return i+1;
        }
    }
}


/** Retrieves the OauthToken. */
function getToken() {
    return ScriptApp.getOAuthToken();
}

//--------------------------------------------------------------------------------------------------------------------
function findWithoutCriteria() {
    const newToken = getToken();
    const request = 'https://docs.google.com/spreadsheets/d/1Bswrjv8evr2PAP5Cmnfb3XbI5voxMeDwBdvLxurf-5A/gviz/tq?access_token=' + newToken + '&select%20*%20&sheet=StudentTable&tqx=reqId%3A0'

    const response =  UrlFetchApp.fetch(request).getContentText();
    const dataTable = convertQueryResponseToDataArray(response);

    return dataTable;
}

function convertQueryResponseToDataArray(responseText) {
    let jsonText = responseText.replace("google.visualization.Query.setResponse(", "");
    jsonText = jsonText.replace("/*O_o*/", "");
    jsonText = jsonText.slice(0, -2);
    return JSON.parse(jsonText).table;
}

// Expose public functions by attaching to `global`

global.doGet = doGet;
global.deleteSheetRow = deleteSheetRow;
global.createSheetRow = createSheetRow;
