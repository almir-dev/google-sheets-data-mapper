import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import { ExtracurricularActivity } from "./app/entity/ExtracurricularActivity";
import { Major } from "./app/entity/Major";
import { Professor } from "./app/entity/Professor";
import { Address } from "./app/entity/Address";
import { Student } from "./app/entity/Student";
import { EntityManager } from "./libs/entity/EntityManager";

function AppContent() {
  React.useEffect(() => {
    initEntityClasses();
  }, []);

  const student = new Student();
  student.id = "id1";

  //Student.delete(student);

  return <div>Working</div>;
}

function initEntityClasses() {
  EntityManager.register("Address", new Address());
  EntityManager.register("ExtracurricularActivity", new ExtracurricularActivity());
  EntityManager.register("Major", new Major());
  EntityManager.register("Professor", new Professor());
  EntityManager.register("Student", new Student());
}

ReactDOM.render(<AppContent />, document.getElementById("root"));
