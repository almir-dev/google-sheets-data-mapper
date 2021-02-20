import React from "react";
import ReactDOM from "react-dom";
import {
  PersistenceManager,
  PersistenceManagerConfig,
  PersistenceManagerScope
} from "./libs/persistence/PersistenceManager";
import { SheetManager } from "./libs/SheetManager";
import "bootstrap/dist/css/bootstrap.css";
import {Student, StudentInstance} from "./app/entity/Student";
import { ExtracurricularActivity } from "./app/entity/ExtracurricularActivity";
import {Major, MajorInstance} from "./app/entity/Major";
import { Professor } from "./app/entity/Professor";
import { Address } from "./app/entity/Address";
import {and, or, QueryOperation, whereEq} from "./libs/criteria/QueryOperation";

const config: PersistenceManagerConfig = {
  apiKey: "secret",
  clientId: "secret",
  scope: PersistenceManagerScope.FULL
};

export const defaultSheetId = "secret";

function AppContent() {
  const [ready, setReady] = React.useState<boolean>(false);
  React.useEffect(() => {
    PersistenceManager.init(config).then(() => setReady(true));
    SheetManager.setActiveSheet(defaultSheetId);
  }, []);

  if (!ready) {
    return null;
  }

  const ea = new ExtracurricularActivity();
  const major = new Major();
  const professor = new Professor();
  const address = new Address();

  // Student.findAll().then(result => {
  //   console.log('WWW result', result);
  // });

  const criteria: QueryOperation = or(
      whereEq(StudentInstance.homeState, 'CA'),
      whereEq(StudentInstance.homeState, 'NY')
  );
  Student.find(criteria).then(result => {
    console.log('WWW result', result);
  })

  return null;
}

ReactDOM.render(<AppContent />, document.getElementById("root"));
