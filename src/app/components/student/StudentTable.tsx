import MaterialTable, { Column, Options } from "material-table";
import { StudentEntity } from "../../entity/StudentEntity";
import React from "react";
import "./StudentTable.scss";
import { StudentService } from "./StudentService";
import { CircularProgress } from "@material-ui/core";
import { ContactInfoEntity, ContactInfoInstance } from "../../entity/ContactInfoEntity";
import { whereEq } from "../../../datamapper/libs/criteria/QueryOperation";
import { ExtracurricularActivityEntity } from "../../entity/ExtracurricularActivityEntity";

const TableColumns: Column<StudentEntity>[] = [
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

  const handleOnRowAdd = React.useCallback(
    (newData: StudentEntity) => {
      return ContactInfoEntity.find<ContactInfoEntity>(
        whereEq(ContactInfoInstance.city, newData.contactInfo.city)
      ).then(result => {
        if (!result.length) {
          const newContact = new ContactInfoEntity();
          newContact.city = newData.contactInfo.city;
          newContact.phoneNumber = newData.contactInfo.phoneNumber;
          return ContactInfoEntity.create<ContactInfoEntity>(newContact).then(c => {
            const newStudent = new StudentEntity();
            newStudent.contactInfo = c;
            newStudent.name = newData.name;
            newStudent.gender = newData.gender;
            newStudent.classLevel = newData.classLevel;
            return ExtracurricularActivityEntity.findById<ExtracurricularActivityEntity>("id1").then(result => {
              newStudent.eActivity = result;
              return StudentEntity.create(newStudent).then(result => {
                setStudents([result, ...students]);
                return Promise.resolve();
              });
            });
          });
        } else {
          const newStudent = new StudentEntity();
          newStudent.contactInfo = result[0];
          newStudent.name = newData.name;
          newStudent.gender = newData.gender;
          newStudent.classLevel = newData.classLevel;
          return ExtracurricularActivityEntity.findById<ExtracurricularActivityEntity>("id1").then(result => {
            newStudent.eActivity = result;
            return StudentEntity.create(newStudent).then(result => {
              const updatedStudents = [result, ...students];
              setStudents(updatedStudents);
              return Promise.resolve();
            });
          });
        }
      });
    },
    [students]
  );

  const handleOnRowUpdate = React.useCallback(
    (newData: StudentEntity, oldData?: StudentEntity) => {
      const target = students.find(e => e.id === oldData!.id)!;
      target.id = newData.id;
      target.name = newData.name;
      target.gender = newData.gender;
      target.classLevel = newData.classLevel;
      target.contactInfo.city = newData.contactInfo.city;
      target.contactInfo.phoneNumber = newData.contactInfo.phoneNumber;
      target.contactInfo.id = newData.contactInfo.id;

      return StudentEntity.update(target)
        .then(() => {
          const updatedStudents = [...students];
          for (let i = 0; i < updatedStudents.length; ++i) {
            if (updatedStudents[i].id === oldData?.id) {
              updatedStudents[i] = target;
            }
          }
          setStudents(updatedStudents);
          return Promise.resolve(updatedStudents);
        })
        .catch(() => Promise.reject());
    },
    [students]
  );

  const handleOnRowDelete = React.useCallback(
    (rowData: StudentEntity) => {
      return StudentEntity.delete(rowData)
        .then(() => {
          const updatedStudents = students.filter(e => e.id !== rowData.id);
          setStudents(updatedStudents);
          return Promise.resolve();
        })
        .catch(() => Promise.reject());
    },
    [students]
  );

  if (!students.length) {
    return <CircularProgress />;
  }

  const editable = {
    onRowDelete: handleOnRowDelete,
    onRowUpdate: handleOnRowUpdate,
    onRowAdd: handleOnRowAdd
  };

  const options: Options = {
    paging: true,
    emptyRowsWhenPaging: true
  };

  return (
    <div className={"studentTable"}>
      <MaterialTable columns={TableColumns} data={students} page={15} options={options} editable={editable} />
    </div>
  );
}
