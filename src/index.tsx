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

  // ClassEntity.findAll<any>().then(result => {
  //   console.log('WWW result', result[0].getSpreadsheetName());
  //   console.log('WWW result', result[0].department.getSpreadsheetName());
  // })

  ClassEntity.findAll<ClassEntity>().then(result => {
    result[0].name = result[0].name + "almir1";
    result[0].professor.name = result[0].professor.name + "mojo";
    result[0].department.name = result[0].department.name + "jojo";

    result[1].name = result[1].name + "almir2";
    result[1].professor.name = result[1].professor.name + "mojo222";
    result[1].department.name = result[1].department.name + "jojo222";

    ClassEntity.update(result[0]);
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
