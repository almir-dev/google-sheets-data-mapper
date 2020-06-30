import React from "react";
import style from "./StudentView.module.scss";
import { Student } from "../entity/Student";
import { StudentService } from "../service/StudentService";
import DataTable, { IDataTableColumn } from "react-data-table-component";

export function StudentView() {
  React.useEffect(() => {
    StudentService.getStudents().then(students => setStudents(students));
  }, []);

  const [students, setStudents] = React.useState<Student[]>([]);

  return <StudentViewContent students={students} />;
}

export function StudentViewContent({ students }: { students: Student[] }) {
  return (
    <div className={"row no-gutters " + style.studentView}>
      <div className={"col-2"}>
        <Filters />
      </div>
      <div className={"col"}>
        <Students students={students} />
      </div>
    </div>
  );
}

export function Filters() {
  return <div className={style.filterSection}>filters</div>;
}

const TableColumns: IDataTableColumn<Student>[] = [
  {
    name: "Student Name",
    cell: data => data.name
  },
  {
    name: "Gender",
    cell: data => data.gender
  },
  {
    name: "Class Level",
    cell: data => data.classLevel
  },
  {
    name: "Home State",
    cell: data => data.homeState
  },
  {
    name: "Extracurricular Activity",
    cell: data => data.eActivity
  }
];

export function Students({ students }: { students: Student[] }) {
  return (
    <div className={style.dataSection}>
      <DataTable data={students} columns={TableColumns} noHeader={true} />
    </div>
  );
}
