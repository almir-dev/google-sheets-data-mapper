/**
 * Method needed by google, the generated html out of it will be used to deploy as a web app.
 * @return {GoogleAppsScript.HTML.HtmlOutput}
 */
function doGet() {
    return HtmlService.createTemplateFromFile("diploma.html").evaluate();
}

/** Retrieves the OauthToken. */
function getToken() {
    return ScriptApp.getOAuthToken();
}

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

function lockSheet(spreadSheetId, sheetName) {
    const sheet = SpreadsheetApp.openById(spreadSheetId).getSheetByName(sheetName);
    const editors = sheet.protect().getEditors();
    const currentEditor = Session.getActiveUser().getEmail();

    editors.forEach(e => {
        if(e.getEmail() !== currentEditor) {
            sheet.protect().removeEditor(e.getEmail());
        }
    });
}

function unlockSheet(spreadSheetId, sheetName) {
    const sheet = SpreadsheetApp.openById(spreadSheetId).getSheetByName(sheetName);
    sheet.protect().remove()
}


function findRowNumberByLookupValue(spreadSheetId, sheetName, columnNumber, searchString) {
    const sheet = SpreadsheetApp.openById(spreadSheetId).getSheetByName(sheetName);
    const values = sheet.getDataRange().getValues();

    for(let i=0; i < values.length; ++i) {
        if(values[i][columnNumber] === searchString) {
            return i+1;
        }
    }
}

function deleteSheetRow(spreadSheetName, sheetName, pkColumnName, pkValue) {
    const spreadSheetId = findSheetIdByName(spreadSheetName);
    const sheet = SpreadsheetApp.openById(spreadSheetId).getSheetByName(sheetName);

    lockSheet(spreadSheetId, sheetName);

    const columnNumber = getColByName(spreadSheetId, sheetName, pkColumnName);
    const rowToDelete = findRowNumberByLookupValue(spreadSheetId, sheetName, columnNumber, pkValue);
    sheet.deleteRow(rowToDelete);

    unlockSheet(spreadSheetId, sheetName);
}


function findSheetIdByName(spreadsheetName) {
    return DriveApp.getFilesByName(spreadsheetName).next().getId();
}

function getColByName(spreadSheetId, sheetName, columnName) {

    // get column headers as an array to search through
    const headers = SpreadsheetApp.openById(spreadSheetId).getSheetByName(sheetName).getDataRange().getValues().shift();

    // search array looking for specific text to return its position
    const colindex = headers.indexOf(columnName);
    return colindex+1;

}

// Expose public functions by attaching to `global`
global.getColByName = getColByName;
global.deleteSheetRow = deleteSheetRow;
global.lockSheet = lockSheet;
global.unlockSheet = unlockSheet;
global.findWithoutCriteria = findWithoutCriteria;
global.doGet = doGet;
