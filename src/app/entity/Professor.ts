import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, JoinColumn, PrimaryKey } from "../../libs/entity/Dto";
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
  @JoinColumn("D", "DepartmentEntity")
  department = ({} as unknown) as DepartmentEntity;
}
