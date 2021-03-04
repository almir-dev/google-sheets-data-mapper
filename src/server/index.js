function doGet() {
    return HtmlService.createTemplateFromFile("diploma.html").evaluate();
}

function testFoo() {
    return ScriptApp.getScriptId();
}

// Expose public functions by attaching to `global`
global.doGet = doGet;
global.testFoo = testFoo;
