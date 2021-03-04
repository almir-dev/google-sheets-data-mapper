import { Column, Options } from "material-table";
import { Student } from "../entity/Student";
import React from "react";

const TableColumns: Column<Student>[] = [
  {
    title: "Id",
    field: "id"
  },
  {
    title: "Student Name",
    field: "name"
  },
  {
    title: "Gender",
    field: "gender"
  },
  {
    title: "Class Level",
    field: "classLevel"
  },
  {
    title: "Home State",
    field: "major"
  },
  {
    title: "Extracurricular Activity",
    field: "eActivity"
  }
];

export function Students({ students }: { students: Student[] }) {
  const options: Options = {
    paging: true,
    pageSize: 16,
    emptyRowsWhenPaging: true
  };

  return (
    <div>
      Almir
      {/*{students[0].name}*/}
      {/*<MaterialTable columns={TableColumns} data={students} title={"Students"} page={15} options={options} />*/}
    </div>
  );
}
