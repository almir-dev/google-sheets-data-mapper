import React from "react";
import ReactDOM from "react-dom";
import { StudentEntity } from "./app/entity/StudentEntity";
import { EntityManager } from "./libs/entity/EntityManager";
import { FacultyEntity } from "./app/entity/FacultyEntity";
import { DepartmentEntity } from "./app/entity/DepartmentEntity";
import { ProfessorEntity } from "./app/entity/Professor";
import { ClassEntity } from "./app/entity/ClassEntity";
import { ContactInfoEntity } from "./app/entity/ContactInfoEntity";
import { ExtracurricularActivityEntity } from "./app/entity/ExtracurricularActivityEntity";

function AppContent() {
  React.useEffect(() => {
    initEntityClasses();
  }, []);

  StudentEntity.findAll<StudentEntity>().then(stundets => {
    const c = stundets[0];
    c.id = "moo";
    c.name = "ASDADASD";
    StudentEntity.create(c).then(() => {
      StudentEntity.delete(c);
    });
  });

  return <>Test</>;
  //return <FacultyView />;
}

function initEntityClasses() {
  EntityManager.register("FacultyEntity", FacultyEntity);
  EntityManager.register("DepartmentEntity", DepartmentEntity);
  EntityManager.register("ProfessorEntity", ProfessorEntity);
  EntityManager.register("ClassEntity", ClassEntity);
  EntityManager.register("StudentEntity", StudentEntity);
  EntityManager.register("ContactInfoEntity", ContactInfoEntity);
  EntityManager.register("ExtracurricularActivityEntity", ExtracurricularActivityEntity);
}

ReactDOM.render(<AppContent />, document.getElementById("root"));
