import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {
  PersistenceManager,
  PersistenceManagerConfig,
  PersistenceManagerScope
} from "./api/PersistenceManager";
import { SheetManager } from "./api/SheetManager";

const config: PersistenceManagerConfig = {
  apiKey: "secret",
  clientId: "secret",
  scope: PersistenceManagerScope.FULL
};

export const defaultSheetId = "secret";

PersistenceManager.init(config);
SheetManager.setActiveSheet(defaultSheetId);

ReactDOM.render(<App />, document.getElementById("root"));
