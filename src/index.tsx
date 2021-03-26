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

  Student.findAll().then(result => {
    console.log("WWW result", result);
    const foo: Student = (result[2] as unknown) as Student;
    foo.name = "Updated name";
    //Student.update(foo);
  });

  return <div>Working</div>;
}

function initEntityClasses() {
  EntityManager.register("Address", Address);
  EntityManager.register("ExtracurricularActivity", ExtracurricularActivity);
  EntityManager.register("Major", Major);
  EntityManager.register("Professor", Professor);
  EntityManager.register("Student", Student);
}

ReactDOM.render(<AppContent />, document.getElementById("root"));
