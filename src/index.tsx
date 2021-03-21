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

  //Student.delete(student);

  const address = new Address();
  address.id = "addressId";
  address.address = "SomeAdress";

  const profesor = new Professor();
  profesor.id = "profesorId";
  profesor.address = address;

  const major = new Major();
  major.id = "majorId";
  major.name = "Science";
  major.professor = profesor;

  const eActivity = new ExtracurricularActivity();
  eActivity.id = "eActivityId";
  eActivity.name = "Eating";

  const student = new Student();
  student.name = "Benjamin";
  student.homeState = "FBIH";
  student.classLevel = "Senior";
  student.eActivity = eActivity;
  student.gender = "Male";
  student.id = "studentId";
  student.major = major;

  Student.create(student);

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
