import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, OneToOneColumn, PrimaryKey } from "../../libs/entity/Dto";
import { DepartmentEntity } from "./DepartmentEntity";

@Entity("StudentsSpreadsheet", "ProfessorTable", "ProfessorEntity")
export class ProfessorEntity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @Column("C")
  address = "";
  @OneToOneColumn("D", "DepartmentEntity")
  department = ({} as unknown) as DepartmentEntity;
}
