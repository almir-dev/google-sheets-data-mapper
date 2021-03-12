function doGet() {
    return HtmlService.createTemplateFromFile("diploma.html").evaluate();
}

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


// Expose public functions by attaching to `global`
global.doGet = doGet;
global.findWithoutCriteria = findWithoutCriteria;
