import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, OneToMany, PrimaryKey } from "../../libs/entity/Dto";
import { DepartmentEntity } from "./DepartmentEntity";

@Entity("StudentsSpreadsheet", "FacultyTable", "FacultyEntity")
export class FacultyEntity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @Column("C")
  shortName = "";
  @Column("D")
  image = "";
  @Column("E")
  phoneNumber = "";
  @Column("F")
  address = "";
  @Column("G")
  description = "";
  @OneToMany("faculty", "DepartmentEntity")
  departments: DepartmentEntity[] = [];
}
