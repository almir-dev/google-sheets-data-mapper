import server from "./server/server";
import React from "react";
import ReactDOM from "react-dom";
import {
  PersistenceManager,
  PersistenceManagerConfig,
  PersistenceManagerScope
} from "./libs/persistence/PersistenceManager";
import "bootstrap/dist/css/bootstrap.css";
import { ExtracurricularActivity } from "./app/entity/ExtracurricularActivity";
import { Major } from "./app/entity/Major";
import { Professor } from "./app/entity/Professor";
import { Address } from "./app/entity/Address";
import { StandaloneSheetManager } from "./libs/manager/StandaloneSheetManager";
import { Student } from "./app/entity/Student";
import { EntityManager } from "./libs/entity/EntityManager";

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
    StandaloneSheetManager.setActiveSheet(defaultSheetId);
    initEntityClasses();
  }, []);

  if (!ready) {
    return <div>Almir</div>;
  }

  Student.findAll()
    .then(result => console.log("WWW result", result))
    .catch(error => console.log("WWW error", error));

  return <div>test6</div>;
}

function initEntityClasses() {
  EntityManager.register("Address", new Address());
  EntityManager.register("ExtracurricularActivity", new ExtracurricularActivity());
  EntityManager.register("Major", new Major());
  EntityManager.register("Professor", new Professor());
  EntityManager.register("Student", new Student());
}

ReactDOM.render(<AppContent />, document.getElementById("root"));
