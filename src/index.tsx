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
  address.address = "someAddresss234234234";

  const profesor = new Professor();
  profesor.id = "professorId";
  profesor.name = "profesor name";
  profesor.address = address;

  const major = new Major();
  major.id = "majorId";
  major.name = "Science1";
  major.professor = profesor;

  const eActivity = new ExtracurricularActivity();
  eActivity.id = "eActivityId";
  eActivity.name = "Eating1";

  const student = new Student();
  student.name = "Benjamin1sdsdsd";
  student.homeState = "FBIH1sdsdsd";
  student.classLevel = "Senior1sdsdsdsd";
  student.eActivity = eActivity;
  student.gender = "Male1";
  student.id = "studentId";
  student.major = major;

  //Student.create(student);
  Student.update(student);

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
