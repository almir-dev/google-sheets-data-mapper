import React from "react";
import ReactDOM from "react-dom";
// import "bootstrap/dist/css/bootstrap.css";
import { ExtracurricularActivity } from "./app/entity/ExtracurricularActivity";
import { Major } from "./app/entity/Major";
import { Professor } from "./app/entity/Professor";
import { Address } from "./app/entity/Address";
import { Student } from "./app/entity/Student";
import { EntityManager } from "./libs/entity/EntityManager";
import { StudentView } from "./app/components/StudentView";

function AppContent() {
  React.useEffect(() => {
    initEntityClasses();
  }, []);

  return <StudentView />;
}

function initEntityClasses() {
  EntityManager.register("Address", Address);
  EntityManager.register("ExtracurricularActivity", ExtracurricularActivity);
  EntityManager.register("Major", Major);
  EntityManager.register("Professor", Professor);
  EntityManager.register("Student", Student);
}

ReactDOM.render(<AppContent />, document.getElementById("root"));
