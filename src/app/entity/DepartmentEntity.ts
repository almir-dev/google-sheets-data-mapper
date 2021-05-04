import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, ManyToOneColumn, PrimaryKey } from "../../libs/entity/Dto";
import { FacultyEntity } from "./FacultyEntity";

@Entity("StudentsSpreadsheet", "DepartmentTable", "DepartmentEntity")
export class DepartmentEntity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @ManyToOneColumn("C", "FacultyEntity")
  faculty = ({} as unknown) as FacultyEntity;
}
