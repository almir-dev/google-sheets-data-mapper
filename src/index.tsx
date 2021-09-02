import React from "react";
import ReactDOM from "react-dom";
import { StudentEntity } from "./app/entity/StudentEntity";
import { EntityManager } from "./datamapper/libs/entity/EntityManager";
import { FacultyEntity } from "./app/entity/FacultyEntity";
import { DepartmentEntity } from "./app/entity/DepartmentEntity";
import { ProfessorEntity } from "./app/entity/Professor";
import { ClassEntity } from "./app/entity/ClassEntity";
import { ContactInfoEntity } from "./app/entity/ContactInfoEntity";
import { ExtracurricularActivityEntity } from "./app/entity/ExtracurricularActivityEntity";
import { FacultyView } from "./app/components/menu/FacultyView";

function AppContent() {
  const [ready, setReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    setReady(initEntityClasses());
  }, []);

  return ready ? <App /> : null;
}

function App() {
  return null;
}

function initEntityClasses(): boolean {
  EntityManager.register("FacultyEntity", FacultyEntity);
  EntityManager.register("DepartmentEntity", DepartmentEntity);
  EntityManager.register("ProfessorEntity", ProfessorEntity);
  EntityManager.register("ClassEntity", ClassEntity);
  EntityManager.register("StudentEntity", StudentEntity);
  EntityManager.register("ContactInfoEntity", ContactInfoEntity);
  EntityManager.register("ExtracurricularActivityEntity", ExtracurricularActivityEntity);
  return true;
}

ReactDOM.render(<AppContent />, document.getElementById("root"));

export function executeGeneration() {
  console.log("Start");
  initEntityClasses();

  // @ts-ignore
  document.getElementById("myInput").addEventListener("click", function() {
    FacultyEntity.findAll<FacultyEntity>().then(faculties => {
      const list = document.getElementById('list-items');

      faculties.forEach(f => {
        const entry = document.createElement('li');
        entry.appendChild(document.createTextNode(f.name));

        // @ts-ignore
        list.appendChild(entry);
      });
    })
  });

  console.log("End");
}

executeGeneration();
