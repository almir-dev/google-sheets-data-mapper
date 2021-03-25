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
  address.address = "Benjina addresa";

  const profesor = new Professor();
  profesor.id = "professorId";
  profesor.name = "benjin profesor";
  profesor.address = address;

  const major = new Major();
  major.id = "majorId";
  major.name = "benjina nauka";
  major.professor = profesor;

  const eActivity = new ExtracurricularActivity();
  eActivity.id = "eActivityId";
  eActivity.name = "benjino jelo";

  const student = new Student();
  student.name = "BEnjo";
  student.homeState = "FBIH1sdsdsd";
  student.classLevel = "asdasd=342340923-4902-34920934";
  student.eActivity = eActivity;
  student.gender = "Male100%";
  student.id = "studentId";
  student.major = major;

  const address2 = new Address();
  address2.id = "id4";
  address2.address = "Tuzla";

  const profesor2 = new Professor();
  profesor2.id = "id2";
  profesor2.name = "Mr. Edward";
  profesor2.address = address2;

  const major2 = new Major();
  major2.id = "id1";
  major2.name = "Math102";
  major2.professor = profesor2;

  const eActivity2 = new ExtracurricularActivity();
  eActivity2.id = "id3";
  eActivity2.name = "Eating102";

  const student2 = new Student();
  student2.name = "Dzeno";
  student2.homeState = "BIH";
  student2.classLevel = "Junior";
  student2.eActivity = eActivity2;
  student2.gender = "Male1";
  student2.id = "id14";
  student2.major = major2;

  //Student.create(student);
  Student.updateMany([student, student2]);
  //Student.update(student);

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
