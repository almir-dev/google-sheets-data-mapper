import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, ManyToOne, PrimaryKey } from "../../libs/entity/Dto";
import { FacultyEntity } from "./FacultyEntity";

@Entity("StudentsSpreadsheet", "DepartmentTable", "DepartmentEntity")
export class DepartmentEntity extends Dto<DepartmentEntity> {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @ManyToOne("C", "FacultyEntity")
  faculty = ({} as unknown) as FacultyEntity;
}
