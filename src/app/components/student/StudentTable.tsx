import MaterialTable, { Column, Options } from "material-table";
import { StudentEntity } from "../../entity/StudentEntity";
import React from "react";
import "./StudentTable.scss";
import { StudentService } from "./StudentService";

const TableColumns: Column<StudentEntity>[] = [
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
    title: "City",
    field: "contactInfo.city"
  },
  {
    title: "Phone Number",
    field: "contactInfo.phoneNumber"
  }
];

export function StudentTable() {
  const [students, setStudents] = React.useState<StudentEntity[]>([]);

  React.useEffect(() => {
    StudentService.getAllStudents().then(result => {
      setStudents(result);
    });
  }, []);

  const handleOnRowUpdate = React.useCallback((newData: StudentEntity, oldData?: StudentEntity) => {
    return Promise.resolve(newData);
  }, []);

  if (!students.length) {
    return <>'LOADING'</>;
  }

  const editable = {
    onRowUpdate: handleOnRowUpdate
  };

  const options: Options = {
    paging: true,
    emptyRowsWhenPaging: true
  };

  return (
    <div className={"studentTable"}>
      <MaterialTable
        columns={TableColumns}
        data={students}
        title={"Students"}
        page={15}
        options={options}
        editable={editable}
      />
    </div>
  );
}
