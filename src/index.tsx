import React from "react";
import ReactDOM from "react-dom";
import {
  PersistenceManager,
  PersistenceManagerConfig,
  PersistenceManagerScope
} from "./libs/persistence/PersistenceManager";
import { SheetManager } from "./libs/SheetManager";
import { StudentView } from "./app/components/StudentView";
import "bootstrap/dist/css/bootstrap.css";

const config: PersistenceManagerConfig = {
  apiKey: "secret",
  clientId: "secret",
  scope: PersistenceManagerScope.FULL
};

export const defaultSheetId = "secret";

PersistenceManager.init(config);
SheetManager.setActiveSheet(defaultSheetId);

function AppContent() {
  const [ready, setReady] = React.useState<boolean>(false);
  React.useEffect(() => {
    PersistenceManager.init(config).then(() => setReady(true));
    SheetManager.setActiveSheet(defaultSheetId);
  }, []);

  if (!ready) {
    return null;
  }

  return <StudentView />;
}

ReactDOM.render(<AppContent />, document.getElementById("root"));
