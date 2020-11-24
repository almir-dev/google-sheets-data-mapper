import React from "react";
import style from "./StudentView.module.scss";
import { Student } from "../entity/Student";
import { StudentService } from "../service/StudentService";
import { Students } from "./Students";
import { Filters } from "./Filters";

export function StudentView() {
  React.useEffect(() => {
    StudentService.getAllStudents().then(students => setStudents(students));
  }, []);

  const [students, setStudents] = React.useState<Student[]>([]);

  return <StudentViewContent students={students} />;
}

export function StudentViewContent({ students }: { students: Student[] }) {
  return (
    <div className={"row no-gutters " + style.studentView}>
      <div className={"col-3"}>
        <Filters />
      </div>
      <div className={"col"}>
        <Students students={students} />
      </div>
    </div>
  );
}
