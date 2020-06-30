import React from "react";
import ReactDOM from "react-dom";
import {
  PersistenceManager,
  PersistenceManagerConfig,
  PersistenceManagerScope
} from "./api/PersistenceManager";
import { SheetManager } from "./api/SheetManager";
import { StudentView } from "./components/StudentView";
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
    setTimeout(() => {
      setReady(true);
    }, 2000);
  }, []);

  if (!ready) {
    return null;
  }

  return <StudentView />;
}

ReactDOM.render(<AppContent />, document.getElementById("root"));
