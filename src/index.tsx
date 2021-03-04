import server from "./server/server";
import React from "react";
import ReactDOM from "react-dom";
import {
  PersistenceManager,
  PersistenceManagerConfig,
  PersistenceManagerScope
} from "./libs/persistence/PersistenceManager";
import { SheetManager } from "./libs/manager/SheetManager";
import "bootstrap/dist/css/bootstrap.css";
import { Student } from "./app/entity/Student";
import { ExtracurricularActivity } from "./app/entity/ExtracurricularActivity";
import { Major } from "./app/entity/Major";
import { Professor } from "./app/entity/Professor";
import { Address } from "./app/entity/Address";

const config: PersistenceManagerConfig = {
  apiKey: "secret",
  clientId: "secret",
  scope: PersistenceManagerScope.FULL
};

export const defaultSheetId = "secret";

// This is a wrapper for google.script.run that lets us use promises.
const { serverFunctions } = server;

function AppContent() {
  const [ready, setReady] = React.useState<boolean>(false);
  React.useEffect(() => {
    PersistenceManager.init(config).then(() => setReady(true));
    SheetManager.setActiveSheet(defaultSheetId);
  }, []);

  if (!ready) {
    return <div>Almir</div>;
  }

  const ea = new ExtracurricularActivity();
  const major = new Major();
  const professor = new Professor();
  const address = new Address();
  //
  Student.findAll().then(result => {
    console.log("WWW result", result);
  });

  return <div>test2</div>;
}

ReactDOM.render(<AppContent />, document.getElementById("root"));
