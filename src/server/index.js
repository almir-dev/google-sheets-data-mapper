function doGet() {
    return HtmlService.createTemplateFromFile("diploma.html").evaluate();
}

function getScriptId() {
    return ScriptApp.getScriptId();
}

// Expose public functions by attaching to `global`
global.doGet = doGet;
global.getScriptId = getScriptId;
