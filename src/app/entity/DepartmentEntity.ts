import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, JoinColumn, PrimaryKey } from "../../libs/entity/Dto";
import { FacultyEntity } from "./FacultyEntity";

@Entity("StudentsSpreadsheet", "DepartmentTable", "DepartmentEntity")
export class DepartmentEntity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @JoinColumn("C", "FacultyEntity")
  faculty = ({} as unknown) as FacultyEntity;
}
